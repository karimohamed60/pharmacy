class Transfer < ApplicationRecord

    self.table_name = "transfers"

    belongs_to :user, class_name: "User"
    has_many :transfers_medicines, class_name: "TransfersMedicine"
end
