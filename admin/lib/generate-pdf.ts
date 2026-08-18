import jsPDF from 'jspdf'

export interface RegistrationData {
  registrationNumber: string
  fullName: string
  fatherName: string
  motherName: string
  dob: string
  age: number
  gender: string
  bloodGroup: string
  aadhaar: string
  mobile: string
  whatsapp: string
  email: string
  address: string
  city: string
  district: string
  state: string
  country: string
  pinCode: string
  playingPosition: string[]
  strongHand: string
  strongLeg: string
  height: string
  weight: string
  stateTeam: boolean
  nationalTeam: boolean
  university: string
  club: string
  experience: string
  coach: string
  currentAcademy: string
  playingSince: string
  achievements: string
  emergencyName: string
  emergencyRelation: string
  emergencyMobile: string
  emergencyAddress: string
  photoPath?: string
  declarationDate: string
  createdAt: string
}

// Helper function for text
const addText = (doc: jsPDF, text: string, x: number, y: number, size: number = 10, color: string = '#1F1F1F', bold: boolean = false) => {
  doc.setTextColor(color)
  doc.setFontSize(size)
  if (bold) {
    doc.setFont('helvetica', 'bold')
  } else {
    doc.setFont('helvetica', 'normal')
  }
  doc.text(text, x, y)
}

export async function generateRegistrationPDF(data: RegistrationData, photoData?: string) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const pageHeight = 297
  const margin = 15
  let y = margin

  // Colors
  const purple = '#4B136D'
  const darkPurple = '#2E063F'
  const gold = '#FDB515'
  const gray = '#666666'
  const black = '#1F1F1F'

  // Header Banner
  doc.setFillColor(parseInt(purple.slice(1, 3), 16), parseInt(purple.slice(3, 5), 16), parseInt(purple.slice(5, 7), 16))
  doc.rect(0, 0, pageWidth, 50, 'F')
  
  addText(doc, 'IWKL PLAYER REGISTRATION', pageWidth / 2, 25, 24, '#FFFFFF', true)
  addText(doc, 'Season 1 - 2026', pageWidth / 2, 35, 14, gold, true)
  doc.text('IWKL PLAYER REGISTRATION', pageWidth / 2, 25, { align: 'center' })
  doc.text('Season 1 - 2026', pageWidth / 2, 35, { align: 'center' })

  y = 55

  // Registration Number
  doc.setFillColor(255, 255, 255)
  doc.rect(margin, y, pageWidth - 2 * margin, 15, 'F')
  addText(doc, 'Player Registration No.', margin + 5, y + 10, 10, purple, true)
  addText(doc, data.registrationNumber, pageWidth - margin - 5, y + 10, 10, purple, true)
  doc.text(data.registrationNumber, pageWidth - margin - 5, y + 10, { align: 'right' })

  y += 25

  // Section 1: Personal Details
  addSectionHeader(doc, '1', 'PERSONAL DETAILS', y, margin, pageWidth)
  y += 12

  // Photo
  if (photoData) {
    try {
      doc.addImage(photoData, 'JPEG', margin, y, 40, 50)
    } catch (e) {
      console.error('Error adding photo to PDF:', e)
    }
  }

  // Personal fields
  const personalFields = [
    { label: 'Full Name', value: data.fullName },
    { label: "Father's Name", value: data.fatherName },
    { label: "Mother's Name", value: data.motherName },
    { label: 'Date of Birth', value: new Date(data.dob).toLocaleDateString() },
    { label: 'Age', value: `${data.age} years` },
    { label: 'Gender', value: data.gender },
    { label: 'Blood Group', value: data.bloodGroup || 'N/A' },
    { label: 'Aadhaar Number', value: data.aadhaar },
    { label: 'Mobile Number', value: data.mobile },
    { label: 'WhatsApp Number', value: data.whatsapp },
    { label: 'Email', value: data.email },
  ]

  y = addFields(doc, personalFields, y + 55, margin, pageWidth)

  // Section 2: Address
  addSectionHeader(doc, '2', 'ADDRESS', y, margin, pageWidth)
  y += 12

  const addressFields = [
    { label: 'Current Address', value: data.address },
    { label: 'City', value: data.city },
    { label: 'District', value: data.district || 'N/A' },
    { label: 'State', value: data.state },
    { label: 'Country', value: data.country || 'N/A' },
    { label: 'PIN Code', value: data.pinCode },
  ]

  y = addFields(doc, addressFields, y, margin, pageWidth)

  // Section 3: Kabaddi Information
  addSectionHeader(doc, '3', 'KABADDI INFORMATION', y, margin, pageWidth)
  y += 12

  const kabaddiFields = [
    { label: 'Playing Position', value: Array.isArray(data.playingPosition) ? data.playingPosition.join(', ') : data.playingPosition },
    { label: 'Strong Hand', value: data.strongHand || 'N/A' },
    { label: 'Strong Leg', value: data.strongLeg || 'N/A' },
    { label: 'Height', value: data.height || 'N/A' },
    { label: 'Weight', value: data.weight || 'N/A' },
  ]

  y = addFields(doc, kabaddiFields, y, margin, pageWidth)

  // Section 4: Playing Experience
  addSectionHeader(doc, '4', 'PLAYING EXPERIENCE', y, margin, pageWidth)
  y += 12

  const experienceFields = [
    { label: 'State Team', value: data.stateTeam ? 'Yes' : 'No' },
    { label: 'National Team', value: data.nationalTeam ? 'Yes' : 'No' },
    { label: 'University / School', value: data.university || 'N/A' },
    { label: 'Club', value: data.club || 'N/A' },
    { label: 'Years of Experience', value: data.experience || '0' },
    { label: 'Coach', value: data.coach || 'N/A' },
    { label: 'Current Academy', value: data.currentAcademy || 'N/A' },
    { label: 'Playing Since', value: data.playingSince ? new Date(data.playingSince).toLocaleDateString() : 'N/A' },
  ]

  y = addFields(doc, experienceFields, y, margin, pageWidth)

  // Section 5: Achievements
  addSectionHeader(doc, '5', 'ACHIEVEMENTS', y, margin, pageWidth)
  y += 12

  doc.setFillColor(240, 240, 240)
  doc.rect(margin, y, pageWidth - 2 * margin, 40, 'F')
  addText(doc, data.achievements || 'No achievements listed', margin + 5, y + 20, 9, black, false)
  y += 50

  // Section 6: Emergency Contact
  addSectionHeader(doc, '6', 'EMERGENCY CONTACT', y, margin, pageWidth)
  y += 12

  const emergencyFields = [
    { label: 'Name', value: data.emergencyName },
    { label: 'Relation', value: data.emergencyRelation },
    { label: 'Mobile', value: data.emergencyMobile },
    { label: 'Address', value: data.emergencyAddress || 'N/A' },
  ]

  y = addFields(doc, emergencyFields, y, margin, pageWidth)

  // Section 7: Declaration
  doc.setFillColor(parseInt(purple.slice(1, 3), 16), parseInt(purple.slice(3, 5), 16), parseInt(purple.slice(5, 7), 16))
  doc.rect(margin, y, pageWidth - 2 * margin, 35, 'F')
  y += 10
  addText(doc, 'PLAYER DECLARATION', margin + 5, y, 12, '#FFFFFF', true)
  y += 8
  addText(doc, 'I hereby declare that all the information provided by me in this application is true and correct.', margin + 5, y, 8, '#FFFFFF', false)
  y += 5
  addText(doc, 'Declaration Date: ' + (data.declarationDate ? new Date(data.declarationDate).toLocaleDateString() : 'N/A'), margin + 5, y, 8, '#FFFFFF', false)
  y += 40

  // Footer
  doc.setFillColor(240, 240, 240)
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')
  addText(doc, 'Generated Date: ' + new Date().toLocaleString(), margin, pageHeight - 12, 8, gray, false)
  addText(doc, 'Digital Verification ID: ' + generateVerificationId(data.registrationNumber), pageWidth - margin, pageHeight - 12, 8, gray, false)
  doc.text('Digital Verification ID: ' + generateVerificationId(data.registrationNumber), pageWidth - margin, pageHeight - 12, { align: 'right' })

  return doc
}

function addSectionHeader(doc: jsPDF, number: string, title: string, y: number, margin: number, pageWidth: number) {
  // Yellow circle
  doc.setFillColor(253, 181, 21)
  doc.circle(margin + 10, y + 5, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(number, margin + 10, y + 8, { align: 'center' })

  // Purple ribbon
  doc.setFillColor(75, 19, 109)
  doc.rect(margin + 18, y - 2, pageWidth - 2 * margin - 18, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(title, margin + 22, y + 5)
}

function addFields(doc: jsPDF, fields: { label: string; value: string }[], startY: number, margin: number, pageWidth: number): number {
  let y = startY
  const colWidth = (pageWidth - 2 * margin) / 2
  let col = 0

  fields.forEach((field) => {
    const x = margin + col * colWidth
    addText(doc, field.label, x, y, 8, '#666666', true)
    addText(doc, field.value, x, y + 5, 9, '#1F1F1F', false)
    
    col++
    if (col === 2) {
      col = 0
      y += 12
    }
  })

  if (col === 1) {
    y += 12
  }

  return y + 8
}

function generateVerificationId(regNumber: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `IWKL-${regNumber.split('-')[2]}-${timestamp}-${random}`
}
