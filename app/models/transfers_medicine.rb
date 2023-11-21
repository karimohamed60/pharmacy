class TransfersMedicine < ApplicationRecord
    
    self.table_name = "transfers_medicines"

    belongs_to :transfer, class_name: "Transfer"
    belongs_to :medicine, class_name: "Medicine"
end
