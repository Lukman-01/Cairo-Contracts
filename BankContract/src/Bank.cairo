use starknet::{ContractAddress};

#[starknet::contract]
pub mod Bank {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use OwnableComponent::InternalTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::{ContractAddress, get_caller_address, event::EventEmitter, storage::Map};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        usercount: u256,
        users: Map<ContractAddress, User>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct User {
        balance: u256,
        name: ByteArray,
        age: u8,
        hasRegistered: bool,
    }

    // Improved error messages
    mod Errors {
        const ALREADY_REGISTERED: felt252 = 'User already registered';
        const NOT_REGISTERED: felt252 = 'User not registered';
        const INSUFFICIENT_BALANCE: felt252 = 'Insufficient balance';
        const DEPOSIT_TOO_LOW: felt252 = 'Deposit amount must be > 0';
        const INVALID_AGE: felt252 = 'Invalid age provided';
        const INVALID_ADDRESS: felt252 = 'Invalid address provided';
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated,
        DepositMade: DepositMade,
        TransferMade: TransferMade,
        WithdrawalMade: WithdrawalMade,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct AccountCreated {
        #[key]
        user: ContractAddress,
        name: ByteArray,
        age: u8
    }

    #[derive(Drop, starknet::Event)]
    pub struct DepositMade {
        #[key]
        user: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    pub struct TransferMade {
        #[key]
        from: ContractAddress,
        to: ContractAddress,
        amount: u256
    }

    #[derive(Drop, starknet::Event)]
    pub struct WithdrawalMade {
        #[key]
        user: ContractAddress,
        amount: u256
    }

    #[starknet::interface]
    trait IBank<TContractState> {
        fn createAccount(ref self: TContractState, name: ByteArray, age: u8) -> u256;
        fn deposit(ref self: TContractState, amount: u256);
        fn transfer(ref self: TContractState, to: ContractAddress, amount: u256);
        fn withdraw(ref self: TContractState, amount: u256);
        fn withdrawEther(ref self: TContractState, amount: u256);
        // Added view functions
        fn get_balance(self: @TContractState) -> u256;
        fn get_user_info(self: @TContractState, address: ContractAddress) -> User;
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.ownable.initializer(initial_owner);
        self.usercount.write(0); // Initialize usercount
    }

    #[abi(embed_v0)]
    impl BankImpl of IBank<ContractState> {
        fn createAccount(ref self: ContractState, name: ByteArray, age: u8) -> u256 {
            let caller = get_caller_address();
            // Fixed the assertion logic - should check if NOT registered
            assert(!self.users.read(caller).hasRegistered, Errors::ALREADY_REGISTERED);
            // Add age validation
            assert(age > 0 && age < 150, Errors::INVALID_AGE);

            let user = User { balance: 0, name: name.clone(), age, hasRegistered: true };

            self.users.write(caller, user);

            let usercount = self.usercount.read() + 1;
            self.usercount.write(usercount);

            self.emit(Event::AccountCreated(AccountCreated { user: caller, name, age }));

            usercount
        }

        fn deposit(ref self: ContractState, amount: u256) {
            assert(amount > 0, Errors::DEPOSIT_TOO_LOW);
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.hasRegistered, Errors::NOT_REGISTERED);

            user.balance += amount;
            self.users.write(caller, user);

            self.emit(Event::DepositMade(DepositMade { user: caller, amount }));
        }

        fn transfer(ref self: ContractState, to: ContractAddress, amount: u256) {
            let caller = get_caller_address();
            // Prevent self-transfer
            assert(caller != to, Errors::INVALID_ADDRESS);

            let mut from_user = self.users.read(caller);
            assert(from_user.hasRegistered, Errors::NOT_REGISTERED);
            assert(from_user.balance >= amount, Errors::INSUFFICIENT_BALANCE);

            let mut to_user = self.users.read(to);
            assert(to_user.hasRegistered, Errors::NOT_REGISTERED);

            from_user.balance -= amount;
            to_user.balance += amount;

            self.users.write(caller, from_user);
            self.users.write(to, to_user);

            self.emit(Event::TransferMade(TransferMade { from: caller, to, amount }));
        }

        fn withdraw(ref self: ContractState, amount: u256) {
            assert(amount > 0, Errors::DEPOSIT_TOO_LOW);
            let caller = get_caller_address();
            let mut user = self.users.read(caller);
            assert(user.hasRegistered, Errors::NOT_REGISTERED);
            assert(user.balance >= amount, Errors::INSUFFICIENT_BALANCE);

            user.balance -= amount;
            self.users.write(caller, user);

            self.emit(Event::WithdrawalMade(WithdrawalMade { user: caller, amount }));
        }

        fn withdrawEther(ref self: ContractState, amount: u256) {
            self.withdraw(amount);
        }

        // Added view functions
        fn get_balance(self: @ContractState) -> u256 {
            let caller = get_caller_address();
            let user = self.users.read(caller);
            assert(user.hasRegistered, Errors::NOT_REGISTERED);
            user.balance
        }

        fn get_user_info(self: @ContractState, address: ContractAddress) -> User {
            let user = self.users.read(address);
            assert(user.hasRegistered, Errors::NOT_REGISTERED);
            user
        }
    }
}
