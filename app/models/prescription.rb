class Prescription < ApplicationRecord
    
    self.table_name = "prescriptions"

    belongs_to :student, class_name: "Student"
    has_many :prescriptions_medicines, class_name: "PrescriptionsMedicine"
end
