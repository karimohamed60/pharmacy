class SalafRequest < ApplicationRecord

    self.table_name = "salaf_requests"

    belongs_to :student, class_name: "Student"
end
