import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { djangoAPI } from '../makeRequest';
import { useSelector } from 'react-redux';

// Define TypeScript interfaces
interface Patient {
    id: number;
    prenom: string;
    nom: string;
    adresse: string;
    dateNaissance: string;
}

interface Nurse {
    nomUtilisateur: string;
}

interface Consultation {
    id: number;
    patient: Patient;
    infirmier: Nurse;
    Age: number;
    Sexe: number;
    Etat: string;
    EN: string;
    T: string;
    F: string;
    AST: string;
    A: string;
    C: string;
    Dys: string;
    SDRA: string;
    E: string;
    D: string;
    ANS: string;
    AGU: string;
    DD: string;
    Class: number;
    dateConsultation: string;
}

interface UserState {
    id: number;
    nomUtilisateur: string;
    role: string;
}

interface RootState {
    user: UserState;
}

// Helper function to get human-readable values
const getFieldValue = (fieldName: string, value: string | number): string => {
    const valueMap: Record<string, Record<string, string>> = {
        Sexe: { '0': 'Female', '1': 'Male' },
        Etat: { '0': 'Not Pregnant', '1': 'Pregnant' },
        EN: { 'Y': 'Yes', 'N': 'No' },
        T: { 
            'S': 'Dry', 
            'G': 'Productive', 
            'P': 'None' 
        },
        F: { 'Y': 'High (>38.5°C)', 'N': 'Low (≤38.5°C)' },
        AST: { 'Y': 'Persistent Fatigue', 'N': 'No Fatigue' },
        A: { 'Y': 'Yes', 'N': 'No' },
        C: { 'Y': 'Yes', 'N': 'No' },
        Dys: { 'Y': 'Yes', 'N': 'No' },
        SDRA: { 'Y': 'Yes', 'N': 'No' },
        E: { 'Y': 'Yes', 'N': 'No' },
        D: { 'Y': 'Yes', 'N': 'No' },
        ANS: { 'Y': 'Yes', 'N': 'No' },
        AGU: { 'Y': 'Yes', 'N': 'No' },
        DD: { 'Y': 'Yes', 'N': 'No' }
    };

    const strValue = value.toString();
    return valueMap[fieldName]?.[strValue] || strValue;
};

// Safe date formatter
const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
};

// Sub-component: Table Header
const TableHeader = () => (
    <thead className="bg-gray-50">
        <tr>
            {tableColumns.map(column => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.header}
                </th>
            ))}
        </tr>
    </thead>
);

// Sub-component: Table Row
const TableRow = ({
    consultation,
    onClick
}: {
    consultation: Consultation;
    onClick: () => void;
}) => (
    <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onClick}
    >
        {tableColumns.map(column => (
            <td key={`${consultation.id}-${column.key}`} className="px-4 py-3 whitespace-nowrap">
                {column.render(consultation)}
            </td>
        ))}
    </motion.tr>
);

// Sub-component: Patient Info Section
const PatientInfoSection = ({ patient }: { patient: Patient }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Patient Information</h3>
        <InfoItem label="Full Name" value={`${patient.prenom} ${patient.nom}`} />
        <InfoItem label="Date of Birth" value={formatDate(patient.dateNaissance)} />
        <InfoItem label="Address" value={patient.adresse} />
    </div>
);

// Sub-component: Consultation Info Section
const ConsultationInfoSection = ({ consultation }: { consultation: Consultation }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Consultation Details</h3>
        <InfoItem
            label="Date"
            value={formatDate(consultation.dateConsultation)}
        />
        <InfoItem
            label="Nurse"
            value={consultation.infirmier.nomUtilisateur}
        />
        <div>
            <p className="text-sm text-gray-500">Risk Assessment</p>
            <RiskBadge riskLevel={consultation.Class} />
        </div>
    </div>
);

// Sub-component: Demographic Info Section
const DemographicInfoSection = ({ consultation }: { consultation: Consultation }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Demographic Data</h3>
        <div className="grid grid-cols-2 gap-4">
            <InfoItem
                label="Age"
                value={consultation.Age > 0 ? `adult` : 'enfant'}
            />
            <InfoItem
                label="Gender"
                value={getFieldValue('Sexe', consultation.Sexe)}
            />
            <InfoItem
                label="Pregnancy Status"
                value={getFieldValue('Etat', consultation.Etat)}
            />
        </div>
    </div>
);

// Sub-component: Symptoms Info Section
const SymptomsInfoSection = ({ consultation }: { consultation: Consultation }) => {
    const symptoms = useMemo(() => [
        { label: 'Nasal Discharge', field: 'EN' },
        { label: 'Cough Type', field: 'T' },
        { label: 'Fever', field: 'F' },
        { label: 'Fatigue', field: 'AST' },
        { label: 'Anorexia', field: 'A' },
        { label: 'Myalgia', field: 'C' },
        { label: 'Dyspnea', field: 'Dys' },
        { label: 'ARDS', field: 'SDRA' },
        { label: 'Sputum', field: 'E' },
        { label: 'Diarrhea', field: 'D' },
        { label: 'Anosmia', field: 'ANS' },
        { label: 'Ageusia', field: 'AGU' },
        { label: 'D-Dimer', field: 'DD' },
    ], []);

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Symptoms & Conditions
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {symptoms.map(({ label, field }) => (
                    <div key={field} className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-700 font-medium">{label}</span>
                        <span className="text-gray-900 font-semibold">
                            {getFieldValue(field, consultation[field as keyof Consultation])}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Sub-component: Info Item (reusable)
const InfoItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate">{value}</p>
    </div>
);

// Sub-component: Risk Badge
const RiskBadge = ({ riskLevel }: { riskLevel: number }) => (
    <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            riskLevel === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
            {riskLevel === 1 ? 'High Risk ⚠️' : 'Low Risk ✅'}
        </span>
        {riskLevel === 1 && (
            <span className="ml-2 text-xs text-red-600">
                COVID-19 Suspected
            </span>
        )}
    </div>
);

// Sub-component: Loading Spinner
const LoadingSpinner = () => (
    <div className="h-64 flex items-center justify-center">
        <motion.div
            className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
        />
    </div>
);

// Fixed DetailModal with error handling
const DetailModal = ({
  patient,
  consultationsForPatient,
  onClose
}: {
  patient: Patient;
  consultationsForPatient: Consultation[];
  onClose: () => void;
}) => {
  // Ensure consultationsForPatient is always an array
  const safeConsultations = Array.isArray(consultationsForPatient) 
    ? consultationsForPatient 
    : [];

  // Sort consultations by date (newest first)
  const sortedConsultations = useMemo(() => {
    return [...safeConsultations].sort((a, b) => 
      new Date(b.dateConsultation).getTime() - new Date(a.dateConsultation).getTime()
    );
  }, [safeConsultations]);
console.log(sortedConsultations)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Consultation History for {patient.prenom} {patient.nom}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            ✖
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <PatientInfoSection patient={patient} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Patient Summary</h3>
              <InfoItem label="Total Consultations" value={sortedConsultations.length.toString()} />
              <InfoItem 
                label="Latest Risk Assessment" 
                value={sortedConsultations.length > 0 ? 
                  <RiskBadge riskLevel={sortedConsultations[0].Class} /> : 
                  'N/A'
                } 
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Consultation History
          </h3>
          
          {sortedConsultations.map(consultation => (
            <div key={consultation.id} className="mb-8 border rounded-xl p-5 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(consultation.dateConsultation)}
                  </h4>
                  <InfoItem
                    label="Confidence Level:"
                    value={consultation.probability}
                  />
                  <InfoItem
                    label="Risk Assessment"
                    value={<RiskBadge riskLevel={consultation.Class} />}
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Demographic Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Age"
                      value={consultation.Age > 0 ? `adult` : 'enfant'}
                    />
                    <InfoItem
                      label="Gender"
                      value={getFieldValue('Sexe', consultation.Sexe)}
                    />
                    <InfoItem
                      label="Pregnancy Status"
                      value={getFieldValue('Etat', consultation.Etat)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <SymptomsInfoSection consultation={consultation} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Table column definitions
const tableColumns = [
    {
        key: 'patient',
        header: 'Patient',
        render: (c: Consultation) => `${c.patient.prenom} ${c.patient.nom}`
    },
    {
        key: 'dateOfBirth',
        header: 'Date of Birth',
        render: (c: Consultation) => formatDate(c.patient.dateNaissance)
    },
    {
        key: 'date',
        header: 'Consultation Date',
        render: (c: Consultation) => formatDate(c.dateConsultation)
    },
    {
        key: 'age',
        header: 'Age',
        render: (c: Consultation) => c.Age > 0 ? `adult` : 'enfant'
    },
    {
        key: 'gender',
        header: 'Gender',
        render: (c: Consultation) => getFieldValue('Sexe', c.Sexe)
    },
    {
        key: 'nasal',
        header: 'Nasal Discharge',
        render: (c: Consultation) => getFieldValue('EN', c.EN)
    },
    {
        key: 'cough',
        header: 'Cough Type',
        render: (c: Consultation) => getFieldValue('T', c.T)
    },
    {
        key: 'fever',
        header: 'Fever',
        render: (c: Consultation) => getFieldValue('F', c.F)
    },
    {
        key: 'fatigue',
        header: 'Fatigue',
        render: (c: Consultation) => getFieldValue('AST', c.AST)
    },
    {
        key: 'severity',
        header: 'COVID Risk',
        render: (c: Consultation) => <RiskBadge riskLevel={c.Class} />
    }
];

const Patients = () => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchNom, setSearchNom] = useState('');
    const [searchPrenom, setSearchPrenom] = useState('');
    const [searchDate, setSearchDate] = useState('');
    
    // Track selected patient and their consultations
    const [selectedPatient, setSelectedPatient] = useState<{
        patient: Patient;
        consultations: Consultation[];
    } | null>(null);

    // State for patient search
    const [patientSearch, setPatientSearch] = useState({
        nom: '',
        prenom: '',
        dateNaissance: ''
    });
    const [searchedPatientId, setSearchedPatientId] = useState<number | null>(null);
    const [searchingPatient, setSearchingPatient] = useState(false);
    const [patientSearchError, setPatientSearchError] = useState<string | null>(null);

    const currentNurse = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                setLoading(true);
                const response = await djangoAPI({
                    method: 'get',
                    url: '/consultations/'
                });

                if (response.data) {
                    setConsultations(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch consultations:', err);
                setError('Failed to load consultations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    // Get latest consultation for each patient
    const latestConsultations = useMemo(() => {
        const patientMap = new Map<number, Consultation>();
        
        consultations.forEach(consultation => {
            const patientId = consultation.patient.id;
            const existing = patientMap.get(patientId);
            
            if (!existing || 
                new Date(consultation.dateConsultation) > new Date(existing.dateConsultation)) {
                patientMap.set(patientId, consultation);
            }
        });
        
        return Array.from(patientMap.values());
    }, [consultations]);

    useEffect(() => {
        const filtered = latestConsultations.filter(c => {
            const matchesNom = c.patient.nom.toLowerCase().includes(searchNom.toLowerCase());
            const matchesPrenom = c.patient.prenom.toLowerCase().includes(searchPrenom.toLowerCase());
            const matchesDate = searchDate
                ? new Date(c.dateConsultation).toISOString().split('T')[0] === searchDate
                : true;
            
            // Filter by patient ID if we have a searched patient
            const matchesPatient = searchedPatientId
                ? c.patient.id === searchedPatientId
                : true;

            return matchesNom && matchesPrenom && matchesDate && matchesPatient;
        });

        setFilteredConsultations(filtered);
    }, [searchNom, searchPrenom, searchDate, latestConsultations, searchedPatientId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    // Handle patient search
    const handlePatientSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPatientSearchError(null);
        setSearchingPatient(true);
        setSearchedPatientId(null);  // Reset previous search

        try {
            const { nom, prenom, dateNaissance } = patientSearch;

            // Check if at least one search criterion is provided
            if (!nom && !prenom && !dateNaissance) {
                throw new Error('Please provide at least one search criterion');
            }

            const response = await djangoAPI.get('/patients/rechercher/', {
                params: {
                    nom: nom || undefined,
                    prenom: prenom || undefined,
                    dateNaissance: dateNaissance || undefined
                }
            });

            if (response.data) {
                // Set the found patient ID for table filtering
                setSearchedPatientId(response.data.id);
            } else {
                throw new Error('Patient not found');
            }
        } catch (err: any) {
            console.error('Patient search failed:', err);
            setPatientSearchError(err.response?.data?.error || err.message || 'Failed to search patient');
        } finally {
            setSearchingPatient(false);
        }
    };

    // Clear patient search
    const clearPatientSearch = () => {
        setSearchedPatientId(null);
        setPatientSearch({
            nom: '',
            prenom: '',
            dateNaissance: ''
        });
        setPatientSearchError(null);
    };

    // Handle row click to show all consultations for patient
    const handleRowClick = (consultation: Consultation) => {
        const patientConsultations = consultations.filter(
            c => c.patient.id === consultation.patient.id
        );
        
        setSelectedPatient({
            patient: consultation.patient,
            consultations: patientConsultations
        });
    };

    return (
        <div className="text-black min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <h1 className="text-2xl font-bold text-gray-800">Consultation Records</h1>
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col sm:flex-row gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Patient Last Name"
                                    value={searchNom}
                                    onChange={e => setSearchNom(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Patient First Name"
                                    value={searchPrenom}
                                    onChange={e => setSearchPrenom(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="date"
                                    placeholder="Consultation Date"
                                    value={searchDate}
                                    onChange={e => setSearchDate(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Patient Search Section */}


                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="p-6 text-red-600">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <TableHeader />
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {filteredConsultations.map(consultation => (
                                            <TableRow
                                                key={consultation.id}
                                                consultation={consultation}
                                                onClick={() => handleRowClick(consultation)}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>

                            {filteredConsultations.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No consultations found matching your criteria
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {selectedPatient && (
                        <DetailModal
                            patient={selectedPatient.patient}
                            consultationsForPatient={selectedPatient.consultations}
                            onClose={() => setSelectedPatient(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Patients;