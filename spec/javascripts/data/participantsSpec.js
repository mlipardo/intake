import {
  babyDoe,
  caretakerDoe,
} from 'data/participants'

describe('Participants', () => {
  describe('Baby Doe', () => {
    it('is named Baby Doe', () => {
      expect(babyDoe.first_name).toBe('Baby')
      expect(babyDoe.last_name).toBe('Doe')
    })

    it('has no id, descriptor, or screening', () => {
      expect(babyDoe.id).toBeUndefined()
      expect(babyDoe.legacy_descriptor).toBeUndefined()
      expect(babyDoe.screening_id).toBeUndefined()
    })
    it('is a victim', () => {
      expect(babyDoe.roles).toEqual(['Victim'])
    })

    it('has SSB info', () => {
      expect(babyDoe.safely_surrendered_babies).toBeDefined()
      expect(babyDoe.safely_surrendered_babies.surrendered_by).toBe('Unknown Doe')
      expect(babyDoe.safely_surrendered_babies.relation_to_child).toBe('1592')
      expect(babyDoe.safely_surrendered_babies.parent_guardian_given_bracelet_id).toBe('U')
      expect(babyDoe.safely_surrendered_babies.parent_guardian_provided_med_questionaire).toBe('U')
    })
  })

  describe('Caretaker Doe', () => {
    it('is named Unknown Doe', () => {
      expect(caretakerDoe.first_name).toBe('Unknown')
      expect(caretakerDoe.last_name).toBe('Doe')
    })

    it('has no id, descriptor, or screening', () => {
      expect(caretakerDoe.id).toBeUndefined()
      expect(caretakerDoe.legacy_descriptor).toBeUndefined()
      expect(caretakerDoe.screening_id).toBeUndefined()
    })

    it('is a perpetrator', () => {
      expect(caretakerDoe.roles).toEqual(['Perpetrator'])
    })

    it('has an approximate age of 0 days', () => {
      // Yes, this is definitely intended for the caretaker, not the child.
      expect(caretakerDoe.approximate_age).toEqual('0')
      expect(caretakerDoe.approximate_age_units).toEqual('days')
    })
  })
})
