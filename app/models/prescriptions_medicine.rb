class PrescriptionsMedicine < ApplicationRecord

    self.table_name = "prescriptions_medicines"

    belongs_to :prescription, class_name: "Prescription"
end
