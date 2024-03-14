class StudentSerializer
  include JSONAPI::Serializer

  attributes :id, :student_national_id, :student_name

end
