import {
  isPrimaryClientYounger,
  isSecondaryClientYounger,
  formatClientBirthDate,
  getClientBirthDate,
  doesClientHaveDOB,
  isGenderUnknown,
  whenBothHaveDOBandGender,
  whenBothHaveDOBnoGender,
  whenBothHaveDOBnoSecndryGender,
  whenBothHaveDOBnoPrmaryGender,
} from 'common/relationship/relationship_dropdown/helperMethods'
import {
  Frodo,
  Gandalf,
  GandalfNoDOB,
  FrodoUnkownGender,
  GandalfUnknowGender,
} from './relationshipDropdownTestConstants'

describe('helperMethods', () => {
  describe('isPrimaryClientYounger', () => {
    const isPrClientYounger = isPrimaryClientYounger(Frodo.dateOfBirth, Gandalf.dateOfBirth)
    it('returns Frodo as younger', () => {
      expect(isPrClientYounger).toBe(true)
    })
  })

  describe('isSecondaryClientYounger', () => {
    const isSecClientYounger = isSecondaryClientYounger(Frodo.dateOfBirth, Gandalf.dateOfBirth)
    it('returns Gandalf as older', () => {
      expect(isSecClientYounger).toBe(false)
    })
  })

  describe('formatClientBirthDate', () => {
    const formattedClientBirthDate = formatClientBirthDate(Frodo.dateOfBirth)
    it('returns formatted Date', () => {
      expect(formattedClientBirthDate.toString()).toEqual('Thu Mar 13 2003 00:00:00 GMT-0800')
    })
  })

  describe('getClientBirthDate', () => {
    const clientBirthDate = getClientBirthDate(Frodo)
    it('returns formatted DateOfBirth for a given client', () => {
      expect(clientBirthDate.toString()).toEqual('Thu Mar 13 2003 00:00:00 GMT-0800')
    })
  })

  describe('doesClientHaveDOB', () => {
    const clientHasDOB = doesClientHaveDOB(Frodo)
    const clientHasNoDOB = doesClientHaveDOB(GandalfNoDOB)
    it('retruns true if client has DOB', () => {
      expect(clientHasDOB).toBe(true)
    })
    it('returns false if client does not have DOB', () => {
      expect(clientHasNoDOB).toBe(false)
    })
  })

  describe('isGenderUnknown', () => {
    const genderIsKnown = isGenderUnknown(Frodo)
    const genderIsUnknown = isGenderUnknown(GandalfUnknowGender)
    it('returns false if client gender is not U or I', () => {
      expect(genderIsKnown).toBe(false)
    })
    it('retruns true if client gender is U or I', () => {
      expect(genderIsUnknown).toBe(true)
    })
  })

  describe('whenBothHaveDOBandGender', () => {
    const isPrClientYounger = isPrimaryClientYounger(Frodo.dateOfBirth, Gandalf.dateOfBirth)
    const isSecClientYounger = isSecondaryClientYounger(Frodo.dateOfBirth, Gandalf.dateOfBirth)
    const genderCodesReturned = whenBothHaveDOBandGender(Frodo, Gandalf, isPrClientYounger, isSecClientYounger)
    it('returns appropriate gender codes whenBothHaveDOBandGender', () => {
      expect(genderCodesReturned).toContain('mM')
      expect(genderCodesReturned).not.toContain('Mm')
      expect(genderCodesReturned).not.toContain('MF')
    })
  })

  describe('whenBothHaveDOBnoGender', () => {
    const isPrClientYounger = isPrimaryClientYounger(FrodoUnkownGender.dateOfBirth, GandalfUnknowGender.dateOfBirth)
    const isSecClientYounger = isSecondaryClientYounger(FrodoUnkownGender.dateOfBirth, GandalfUnknowGender.dateOfBirth)
    const genderCodesReturned = whenBothHaveDOBnoGender(isPrClientYounger, isSecClientYounger)
    it('returns appropriate gender codes whenBothHaveDOBnoGender', () => {
      expect(genderCodesReturned).toEqual(jasmine.arrayContaining(['fM', 'fF', 'mM', 'mF']))
      expect(genderCodesReturned).not.toEqual(jasmine.arrayContaining(['Fm', 'Ff', 'Mm', 'Mf']))
    })
  })

  describe('whenBothHaveDOBnoSecndryGender', () => {
    const isPrClientYounger = isPrimaryClientYounger(Frodo.dateOfBirth, GandalfUnknowGender.dateOfBirth)
    const isSecClientYounger = isSecondaryClientYounger(Frodo.dateOfBirth, GandalfUnknowGender.dateOfBirth)
    const genderCodesReturned = whenBothHaveDOBnoSecndryGender(Frodo, isPrClientYounger, isSecClientYounger)
    it('returns appropriate gender codes whenBothHaveDOBnoSecndryGender', () => {
      expect(genderCodesReturned).toEqual(jasmine.arrayContaining(['mM', 'mF']))
      expect(genderCodesReturned).not.toEqual(jasmine.arrayContaining(['Mm', 'FM']))
    })
  })

  describe('whenBothHaveDOBnoPrmaryGender', () => {
    const isPrClientYounger = isPrimaryClientYounger(FrodoUnkownGender.dateOfBirth, Gandalf.dateOfBirth)
    const isSecClientYounger = isSecondaryClientYounger(FrodoUnkownGender.dateOfBirth, Gandalf.dateOfBirth)
    const genderCodesReturned = whenBothHaveDOBnoPrmaryGender(Gandalf, isPrClientYounger, isSecClientYounger)
    it('returns appropriate gender codes whenBothHaveDOBnoPrmaryGender', () => {
      expect(genderCodesReturned).toEqual(jasmine.arrayContaining(['mM', 'fM']))
      expect(genderCodesReturned).not.toEqual(jasmine.arrayContaining(['Mm', 'Fm']))
    })
  })
})
