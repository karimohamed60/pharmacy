class TransfersMedicine < ApplicationRecord
    
    self.table_name = "transfers_medicines"

    belongs_to :transfer, class_name: "Transfer"
    belongs_to :medicine, class_name: "Medicine"

    def self.create_transfer_medicines(transfers_params, transfer)
        return unless transfers_params.present?

        transfers_params.each do |transfer_params|
            transfer.transfers_medicines.create(transfer_params.permit(:medicine_id, :quantity))
        end
    end

    def self.update_transfer_medicines(transfers_params, transfer)
        return unless transfers_params.present?
        
        transfers_params.each do |transfer_params|
            transfer_medicine = transfer.transfers_medicines.find_by(medicine_id: transfer_params[:medicine_id])

            if transfer_medicine.present?
                if transfer_params[:destroy].to_s == '1'

                    transfer_medicine.destroy
                else

                    transfer_medicine.update(quantity: transfer_params[:quantity])
                end
            else
                transfer.transfers_medicines.create(medicine_id: transfer_params[:medicine_id], quantity: transfer_params[:quantity])
            end
        end

        true
    end
end
