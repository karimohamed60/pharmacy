ActiveAdmin.register Transfer do
  permit_params :status, :user_id, transfers_medicines_attributes: [:id, :medicine_id, :quantity, :_destroy]

  controller do
    def create
      resource = Transfer.new(permitted_params[:transfer].except(:transfers_medicines))

      insufficient_quantity = false

      resource.transfers_medicines.each do |transfer_medicine|
        quantity_in_inventory = Api::Validators::QuantityValidator.get_quantity_in_inventory(transfer_medicine.medicine_id)

        unless quantity_in_inventory && quantity_in_inventory >= transfer_medicine.quantity
          insufficient_quantity = true
          flash[:error] = "Insufficient quantity of #{transfer_medicine.medicine.commercial_name} in inventory"
          break
        end
      end

      if insufficient_quantity
        resource.transfers_medicines.destroy_all
        flash.delete(:notice)
        redirect_to new_admin_transfer_url
      else
        resource.save

        flash[:notice] = "Transfer was successfully created."
        redirect_to admin_transfers_url

        if resource.status == "accepted"
          resource.transfers_medicines.each do |transfer_medicine|
            medicine = transfer_medicine.medicine
            medicine.quantity_in_inventory -= transfer_medicine.quantity
            medicine.quantity_in_pharmacy += transfer_medicine.quantity
            medicine.save
          end
        end
      end
    end

    def update
      resource = Transfer.find(params[:id])

      resource.assign_attributes(permitted_params[:transfer].except(:transfers_medicines))

      if permitted_params[:transfer][:transfers_medicines_attributes].present?
        resource.transfers_medicines_attributes = permitted_params[:transfer][:transfers_medicines_attributes]
      end

      insufficient_quantity = false

      resource.transfers_medicines.each do |transfer_medicine|
        quantity_in_inventory = Api::Validators::QuantityValidator.get_quantity_in_inventory(transfer_medicine.medicine_id)
        unless quantity_in_inventory && quantity_in_inventory >= transfer_medicine.quantity
          insufficient_quantity = true
          flash[:error] = "Insufficient quantity of #{transfer_medicine.medicine.commercial_name} in inventory"
          break
        end
      end

      if insufficient_quantity
        flash.delete(:notice)
        redirect_to edit_admin_transfer_url(resource)
      elsif resource.save
        flash[:notice] = "Transfer was successfully updated."
        redirect_to admin_transfers_url

        if resource.status == "accepted"
          resource.transfers_medicines.each do |transfer_medicine|
            medicine = transfer_medicine.medicine
            medicine.quantity_in_inventory -= transfer_medicine.quantity
            medicine.quantity_in_pharmacy += transfer_medicine.quantity
            medicine.save
          end
        end
      else
        render :edit
      end
    end
  end

  index do
    selectable_column
    id_column
    column :status
    column :user do |resource|
      resource.user.username
    end
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :status
      row :user
      row :created_at
      row :updated_at
      row :medicines do |resource|
        table_for resource.transfers_medicines do
          column "Medicine" do |transfer_medicine|
            transfer_medicine.medicine.commercial_name
          end
          column :quantity
        end
      end
    end
  end

  filter :status, as: :select, collection: Transfer.statuses
  filter :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }

  form do |f|
    f.inputs "Transfer Details" do
      f.input :status
      f.input :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }
      f.has_many :transfers_medicines, heading: 'Medicines', new_record: 'Add Medicine' do |medicine|
        medicine.input :medicine, as: :select, collection: Medicine.all.collect { |medicine| [medicine.commercial_name, medicine.id] }
        medicine.input :quantity
      end
    end
    f.actions
  end
end
