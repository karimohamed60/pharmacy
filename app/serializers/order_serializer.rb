class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :student_id, :created_at

  attribute :medicines do |object|
    object.order_medicines.map do |medicine|
      {
        id: medicine.medicine_id,
        medicine_name: medicine.medicine.commercial_name,
        quantity: medicine.quantity,
      }
    end
  end
end
