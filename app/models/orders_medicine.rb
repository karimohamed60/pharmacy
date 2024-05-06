class OrdersMedicine < ApplicationRecord

    self.table_name = "orders_medicines"

    belongs_to :order, class_name: "Order"
    belongs_to :medicine, class_name: "Medicine"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "medicine_id", "order_id", "quantity"]
    end
end
