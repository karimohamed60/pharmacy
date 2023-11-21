class Student < ApplicationRecord
    
    self.table_name = "students"

    has_many :prescriptions, class_name: "Prescription"
    has_many :orders, class_name: "Order"
    has_many :salaf_requests, class_name: "SalafRequest"
end
