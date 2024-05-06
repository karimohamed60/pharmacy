class Transfer < ApplicationRecord

    self.table_name = "transfers"

    enum status: { pending: 0, accepted: 1, rejected: 2 }

    belongs_to :user, class_name: "User"
    has_many :transfers_medicines, class_name: "TransfersMedicine", dependent: :destroy
    accepts_nested_attributes_for :transfers_medicines

    def self.ransackable_attributes(auth_object = nil)
        ["id", "status", "user_id", "created_at", "updated_at"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["transfers_medicines", "user"]
    end

    def self.create_transfer(transfer_params)
        transfer = Transfer.new(transfer_params.except(:transfer_medicines))
        transfer
    end
end
