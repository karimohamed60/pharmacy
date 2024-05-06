ActiveAdmin.register Prescription do
  permit_params :student_id, :status, :date, prescriptions_medicines_attributes: [:id, :medicine_name, :dosage, :got_medicine, :quantity, :_destroy]

  index do
    selectable_column
    id_column
    column :student_id
    column :status
    column :date
    actions
  end

  show do
    attributes_table do
      row :student_id
      row :status
      row :date
      row :medicines do |resource|
        table_for resource.prescriptions_medicines do
          column :medicine_name
          column :dosage
          column :got_medicine  
          column :quantity
        end
      end
    end
  end

  filter :student_id
  filter :status, as: :select, collection: Prescription.statuses
  filter :date

  form do |f|
    f.inputs "Prescription Details" do
      f.input :student_id
      f.input :status
      f.input :date, as: :datepicker
      f.has_many :prescriptions_medicines, heading: 'Medicines', new_record: 'Add Medicine' do |medicine|
        medicine.input :medicine_name
        medicine.input :dosage
        medicine.input :got_medicine
        medicine.input :quantity
      end
    end
    f.actions
  end
end
