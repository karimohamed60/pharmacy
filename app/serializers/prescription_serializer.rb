class PrescriptionSerializer
  include JSONAPI::Serializer

  attributes :id, :student_id, :status, :date

  attribute :status do |object|
    if object.status == "pending"
      "pending"
    else
      "finished"
    end 
  end

  attribute :medicines do |object|
    object.prescriptions_medicines.map do |prescription_medicine|
      {
        id: prescription_medicine.id,
        medicine_name: prescription_medicine.medicine_name,
        dosage: prescription_medicine.dosage,
        quantity: prescription_medicine.quantity,
        got_medicine: prescription_medicine.got_medicine
      }
    end
  end
end
