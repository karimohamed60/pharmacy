ActiveAdmin.register Order do
  permit_params :student_id, :user_id, order_medicines_attributes: [:id, :medicine_id, :quantity, :_destroy]

  controller do
    def create
      resource = Order.new(permitted_params[:order])

      resource.order_medicines.each do |order_medicine|
        unless order_medicine.medicine.quantity_in_pharmacy && order_medicine.medicine.quantity_in_pharmacy >= order_medicine.quantity
          flash[:error] = "Insufficient quantity of #{order_medicine.medicine.commercial_name} in pharmacy"
          redirect_to new_admin_order_url
        else
          order_medicine.medicine.quantity_in_pharmacy -= order_medicine.quantity
          order_medicine.medicine.quantity_sold += order_medicine.quantity
          order_medicine.medicine.save

          if resource.save
            flash[:notice] = "Order was successfully created."
            redirect_to admin_orders_url
          end
        end
      end
    end

    def update
      resource = Order.find(params[:id])

      resource.assign_attributes(permitted_params[:order])

      if permitted_params[:order][:order_medicines_attributes].present?
        resource.order_medicines_attributes = permitted_params[:order][:order_medicines_attributes]
      end

      medicine_changed = resource.order_medicines.any? do |order_medicine|
        order_medicine.changed?
      end

      if resource.changed? || medicine_changed
        resource.order_medicines.each do |order_medicine|
          order = OrdersMedicine.find(order_medicine.id)
          previous_qunatity = order.quantity
          difference = order_medicine.quantity - previous_qunatity

          if order.medicine.quantity_in_pharmacy >= difference
            Medicine.update!(order.medicine_id, quantity_in_pharmacy: order.medicine.quantity_in_pharmacy - difference, 
              quantity_sold: order.medicine.quantity_sold + difference)

            if resource.save
              flash[:notice] = "Order was successfully updated."
              redirect_to admin_order_url(resource)
            end
          else
            flash[:error] = "Insufficient quantity of #{order.medicine.commercial_name} in pharmacy."
            redirect_to edit_admin_order_url(resource)
          end
        end
      else
        flash[:notice] = "No changes detected."
        redirect_to admin_order_url(resource)
      end
    rescue StandardError
      flash[:error] = "Error while updating Order."
      redirect_to edit_admin_order_url(resource)
    end
  end

  index do
    selectable_column
    id_column
    column :student
    column :user
    column :created_at
    actions
  end


  show do
    attributes_table do
      row :student
      row :user
      row :created_at
      row :updated_at
      row :medicines do |resource|
        table_for resource.order_medicines do
          column "Medicine" do |order_medicine|
            order_medicine.medicine.commercial_name
          end
          column :quantity
        end
      end
    end
  end


  filter :student_id
  filter :user
  filter :created_at

  form do |f|
    f.inputs "Order Details" do
      f.input :student_id
      f.input :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }
      f.has_many :order_medicines, heading: 'Medicines', new_record: 'Add Medicine' do |medicine|
        medicine.input :medicine, as: :select, collection: Medicine.order(commercial_name: :asc).pluck(:commercial_name, :id)
        medicine.input :quantity
      end
    end
    f.actions
  end
end
