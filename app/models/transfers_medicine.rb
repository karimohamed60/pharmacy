class TransfersMedicine < ApplicationRecord
    
    self.table_name = "transfers_medicines"

    belongs_to :transfer, class_name: "Transfer"
    belongs_to :medicine, class_name: "Medicine"

    def self.create_transfer_medicines(transfers_params, transfer)
        return unless transfers_params.present?

        return false unless Api::Validators::QuantityValidator.validate_quantity_in_inventory(transfers_params)

        transfer.transfers_medicines.create(transfers_params.map { |transfer_params| transfer_params.permit(:medicine_id, :quantity) })
        true
    end

    def self.update_transfer_medicines(transfers_params, transfer)
        return unless transfers_params.present?

        return false unless Api::Validators::QuantityValidator.validate_quantity_in_inventory(transfers_params)

        if transfer.status == 1
            update_quantity_in_inventory = true
        else
            update_quantity_in_inventory = false
        end

        transfers_params.each do |transfer_params|
            transfer_medicine = transfer.transfers_medicines.find_by(medicine_id: transfer_params[:medicine_id])

            if transfer_medicine.present?
                if transfer_params[:destroy].to_s == '1'
                    transfer_medicine.destroy
                else
                    transfer_medicine.update(quantity: transfer_params[:quantity])

                    if update_quantity_in_inventory
                        medicine = Medicine.find(transfer_params[:medicine_id])
                        new_inventory_quantity = medicine.quantity_in_inventory - transfer_params[:quantity].to_i

                        if new_inventory_quantity >= 0
                            medicine.update(quantity_in_inventory: new_inventory_quantity)
                            medicine.update(quantity_in_pharmacy: medicine.quantity_in_pharmacy + transfer_params[:quantity].to_i)
                        else
                            raise StandardError, "Insufficient quantity of #{medicine.name} in inventory"
                        end
                    end
                end
            else
                transfer.transfers_medicines.create(medicine_id: transfer_params[:medicine_id], quantity: transfer_params[:quantity])
            end
        end

        true
    end
end
