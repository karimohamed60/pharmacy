class SalafRequest < ApplicationRecord

    self.table_name = "salaf_requests"

    enum status: { pending: 0, finished: 1 }

    belongs_to :student, class_name: "Student"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "medicine_name", "status", "student_id", "created_at", "updated_at"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["student"]
    end

    def get_student_id(student_national_id)
        student = Student.find_by(student_national_id: student_national_id)
        student.id
    end
end
