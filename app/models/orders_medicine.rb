class OrdersMedicine < ApplicationRecord
    
    self.table_name = "orders_medicines"
    
    belongs_to :order, class_name: "Order"
    belongs_to :medicine, class_name: "Medicine"
end
