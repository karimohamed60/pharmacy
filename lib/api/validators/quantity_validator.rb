module Api
    module Validators
        class QuantityValidator
            def self.validate_quantity_in_inventory(transfers_params)
                transfers_params.each do |transfer_params|
                    quantity_in_inventory = get_quantity_in_inventory(transfer_params[:medicine_id])

                    return false unless quantity_in_inventory && quantity_in_inventory >= transfer_params[:quantity]
                end
                true
            end

            def self.get_quantity_in_inventory(medicine_id)
                medicine = Medicine.find_by(id: medicine_id)
                medicine&.quantity_in_inventory
            end
        end
    end
end