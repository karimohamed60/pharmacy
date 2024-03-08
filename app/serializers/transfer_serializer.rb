class TransferSerializer
  include JSONAPI::Serializer

  attributes :id, :status, :created_at, :updated_at

  attribute :status do |object|
    if object.status == 0
      "pending"
    elsif object.status == 1
      "accepted"
    else
      "rejected"
    end 
  end

  attribute :user do |object|
    {
      user_id:  object.user.id,
      username: object.user.username
    }
  end

  attribute :medicines do |object|
    object.transfers_medicines.map do |transfer_medicine|
      {
        medicine_id: transfer_medicine.medicine_id,
        medicine_name: transfer_medicine.medicine.commercial_name,
        quantity: transfer_medicine.quantity
      }
    end
  end


end