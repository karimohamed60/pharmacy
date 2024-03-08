class Transfer < ApplicationRecord

    self.table_name = "transfers"

    belongs_to :user, class_name: "User"
    has_many :transfers_medicines, class_name: "TransfersMedicine", dependent: :destroy


    def self.create_transfer(transfer_params)
        transfer = Transfer.new(transfer_params.except(:transfer_medicines))
        transfer
    end
end
