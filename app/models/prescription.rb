class Prescription < ApplicationRecord

    self.table_name = "prescriptions"

    belongs_to :student, class_name: "Student"
    has_many :prescriptions_medicines, class_name: "PrescriptionsMedicine"
    accepts_nested_attributes_for :prescriptions_medicines

    enum status: { pending: 0, finished: 1 }

    def self.ransackable_attributes(auth_object = nil)
        ["id", "student_id", "status", "date"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["prescriptions_medicines", "student"]
    end
end
