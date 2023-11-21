class Order < ApplicationRecord
    
    self.table_name = "orders"
    
    belongs_to :student, class_name: "Student"
    belongs_to :user, class_name: "User"
    has_many :orders_medicines, class_name: "OrdersMedicine"
end
