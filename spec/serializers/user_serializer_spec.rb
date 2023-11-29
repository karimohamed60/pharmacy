require 'rails_helper'

RSpec.describe UserSerializer do
  let(:user) { create(:user) }

  subject { described_class.new(user).as_json['data']['attributes'] }
  
  it 'includes the correct attributes' do
    expect(subject).to include(
      'username'  => user.username,
      'full_name' => user.full_name,
      'role_name' => user.role.role_name,
    )
  end
end
