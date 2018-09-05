# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe ScreeningRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:screening_id) { '11' }
    let(:response) { double(:response, body: { 'id' => screening_id, 'name' => 'New Screening' }) }
    let(:screening) { double(:screening, as_json: { 'name' => 'New Screening' }) }

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/intake/screenings', :post, 'name' => 'New Screening')
        .and_return(response)
    end

    it 'returns the created screening' do
      created_screening = JSON.parse(described_class.create(security_token, screening))
      expect(created_screening['id']).to eq(screening_id)
      expect(created_screening['name']).to eq('New Screening')
    end
  end

  describe '.find' do
    let(:screening_id) { '33' }
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Existing Screening' })
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, "/intake/screenings/#{screening_id}", :get)
        .and_return(response)
    end

    it 'returns the existing screening' do
      existing_screening = described_class.find(security_token, screening_id)
      expect(existing_screening['id']).to eq(screening_id)
      expect(existing_screening['name']).to eq('Existing Screening')
    end
  end

  describe '.update' do
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Updated Screening' })
    end
    let(:screening) do
      { id: screening_id, name: 'Updated Screening' }
    end

    context 'when screening has an id' do
      let(:screening_id) { '77' }

      before do
        expect(FerbAPI).to receive(:make_api_call)
          .with(
            security_token,
            "/intake/screenings/#{screening_id}",
            :put,
            screening
          )
          .and_return(response)
      end

      it 'returns the updated screening' do
        updated_screening = described_class.update(security_token, screening)
        expect(updated_screening['id']).to eq(screening_id)
        expect(updated_screening['name']).to eq('Updated Screening')
      end
    end

    context 'when screening has no id' do
      let(:screening_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(security_token, screening)
        end.to raise_error('Error updating screening: id is required')
      end
    end
  end

  describe '.search' do
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/screenings', :get)
        .and_return(response)
    end

    it 'returns the screening results' do
      screening_results = JSON.parse(described_class.search(security_token))
      expect(screening_results.first['id']).to eq('1')
      expect(screening_results.last['id']).to eq('2')
    end
  end

  describe '.history_of_involvements' do
    let(:screening_id) { '11' }

    describe 'in hotline' do
      let(:cases) { [{ legacy_descriptor: '1234' }, { legacy_descriptor: '1235' }] }
      let(:referrals) { [{ legacy_descriptor: '1236' }, { legacy_descriptor: '1237' }] }
      let(:screenings) { [{ legacy_descriptor: '1238' }, { legacy_descriptor: '1239' }] }
      let(:response) do
        double(
          :response,
          body: { screenings: screenings, cases: cases, referrals: referrals }.to_json
        )
      end

      it 'returns the history of involvements from ferb api' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(security_token, "/screenings/#{screening_id}/history_of_involvements", :get)
          .and_return(response)
        hoi = JSON.parse described_class.history_of_involvements(security_token, screening_id)
        expect(hoi['cases'].first['legacy_descriptor']).to eq('1234')
        expect(hoi['cases'].last['legacy_descriptor']).to eq('1235')
        expect(hoi['referrals'].first['legacy_descriptor']).to eq('1236')
        expect(hoi['referrals'].last['legacy_descriptor']).to eq('1237')
        expect(hoi['screenings'].first['legacy_descriptor']).to eq('1238')
        expect(hoi['screenings'].last['legacy_descriptor']).to eq('1239')
      end
    end
  end

  describe '.submit' do
    let(:screening_id) { '42' }
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Submitted Screening' })
    end

    it 'responds with response body' do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, "/screenings/#{screening_id}/submit", :post, {})
        .and_return(response)
      submitted_screening = described_class.submit(security_token, screening_id)
      expect(submitted_screening['id']).to eq(screening_id)
      expect(submitted_screening['name']).to eq('Submitted Screening')
    end
  end

  describe '.contact' do
    let(:referral_id) { '42' }
    let(:response) do
      double(:response, body: { 'id' => referral_id })
    end

    it 'responds with response body' do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, "/investigations/#{referral_id}/contacts", :post, {})
        .and_return(response)
      submitted_screening_contact = described_class.contact(security_token, referral_id, {})
      expect(submitted_screening_contact['id']).to eq(referral_id)
    end
  end
end
