class PrescriptionsMedicine < ApplicationRecord

    self.table_name = "prescriptions_medicines"

    belongs_to :prescription, class_name: "Prescription"

    def self.update_prescription_medicines(prescriptions_params, prescription)
        return unless prescriptions_params.present?

        prescriptions_params.each do |prescription_params|
            prescription_medicine = PrescriptionsMedicine.find_by(id: prescription_params[:id])

            prescription_medicine.update(got_medicine: prescription_params[:got_medicine]) if prescription_medicine.present?
        end

        true
    end
end
