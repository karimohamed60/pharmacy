class SalafRequestSerializer
  include JSONAPI::Serializer

  attributes :student_id, :student_national_id, :student_name, :medicine_name,  :status, :created_at, :updated_at

  attribute :student_national_id do |object|
    object.student.student_national_id
  end

  attribute :student_name do |object|
    object.student.student_name
  end

  attribute :medicine_name do |object|
    JSON.parse(object.medicine_name)
  end

  attribute :status do |object|
    if object.status == "pending"
      "pending"
    else
      "finished"
    end 
  end

  attribute :created_at do |object|
    object.created_at.strftime("%d-%m-%Y")
  end

  attribute :updated_at do |object|
    object.updated_at.strftime("%d-%m-%Y")
  end
end