class TransfersMedicineSerializer
  include JSONAPI::Serializer

  attributes :transfer_id, :medicine_id, :quantity

  belongs_to :transfer_id
  belongs_to :medicine
end