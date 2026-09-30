import mongoose from 'mongoose';

const auditReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: null,
    index: true
  },
  facilityName: {
    type: String,
    required: true,
    default: 'Commercial Campus'
  },
  region: {
    type: String,
    default: 'Pune, Maharashtra'
  },
  discom: {
    type: String,
    default: 'MSEDCL (Maharashtra)'
  },
  gridZone: {
    type: String,
    default: 'Western Grid (IN-WE)'
  },
  grade: {
    type: String,
    default: 'Grade A'
  },
  billedUnitsKwh: {
    type: Number,
    default: 0
  },
  monthlySavingsInr: {
    type: Number,
    default: 0
  },
  carbonDivertedKg: {
    type: Number,
    default: 0
  },
  auditFindings: [{
    category: String,
    status: String,
    detail: String
  }],
  verificationHashSha256: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AuditReport = mongoose.models.AuditReport || mongoose.model('AuditReport', auditReportSchema);
export default AuditReport;
