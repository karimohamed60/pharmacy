class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :student, :medicines, :user, :created_at

  attribute :student do |object|
    {
      id: object.student.id,
      student_name: object.student.student_name,
      student_national_id: object.student.student_national_id,
    }
  end

  attribute :medicines do |object|
    object.order_medicines.map do |medicine|
      {
        id: medicine.medicine_id,
        medicine_name: medicine.medicine.commercial_name,
        quantity: medicine.quantity,
      }
    end
  end

  attribute :user do |object|
    {
      id: object.user.id,
      user_name: object.user.full_name,
    }
  end
end
