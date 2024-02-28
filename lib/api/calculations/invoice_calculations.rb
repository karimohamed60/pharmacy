module Api
    module Calculations
        class InvoiceCalculations
            def self.calculate_total_amount(invoice_medicines)
                total_amount = 0
                
                invoice_medicines.each do |medicine|
                    total_amount += medicine[:amount].to_f
                end

                return total_amount
            end

            def self.calculate_medicine_amount(medicine)
                total_amount = medicine[:price] * medicine[:quantity]
                discount_amount = total_amount * (medicine[:discount] / 100.0)  # Calculate the discount amount (1% of total)
                amount = total_amount - discount_amount 
                medicine[:amount] = amount
            end
        end
    end
end