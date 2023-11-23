require 'rails_helper'

RSpec.describe ApplicationCable::Connection, type: :channel do
  let(:user_id) { 42 }

  it 'connects with cookies' do
    cookies.signed[:user_id] = user_id

    connect

    expect(connection.user_id).to eq(user_id.to_s)
  end
end
