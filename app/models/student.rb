class Student < ApplicationRecord

    self.table_name = "students"

    has_many :prescriptions, class_name: "Prescription"
    has_many :orders, class_name: "Order"
    has_many :salaf_requests, class_name: "SalafRequest"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "student_national_id", "student_name"]
    end
end
