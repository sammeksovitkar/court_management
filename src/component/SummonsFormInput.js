import React, { useState, useMemo, useCallback } from 'react';

// =================================================================
// Initial Data
// =================================================================

const initialFormData = {
  // New selections
  formType: 'साक्षीदारास समन्स', // Default: साक्षीदारास समन्स
  caseType: 'R.C.C.',        // Default: R.C.C.
  
  // Data fields
  caseNo: '',
  accusedName: '',
  lawSection: '',
  summonDate: '', 
  currentDate: new Date().toLocaleDateString('en-GB'), 
  courtLocation: 'मनमाड शहर न्यायालय, ता.नांदगाव जिल्हा नाशिक ',
  policeStation: 'मनमाड शहर',
  court: "न्यायदंडाधिकारी प्रथमवर्ग,",
  witnesses: [
    { name: '', address: '' },
  ],
};

// =================================================================
// PrintLayout Component (Internal - Pure JSX/Marathi Layout)
// =================================================================

const PrintLayout = React.memo(({ data }) => {
  const { 
    formType, caseType, caseNo, accusedName, lawSection, 
    summonDate, currentDate, courtLocation, policeStation, court, 
    witnesses 
  } = data;

  const caseLabel = useMemo(() => {
    if (caseType === 'R.C.C.' || caseType === 'S.C.C.') {
        return `${caseType}. No.`;
    }
    return `${caseType} No.`;
  }, [caseType]);


  const formatDdMmYyyy = useCallback((dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      return dateString;
    }
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }, []);

  const renderCaseNumber = useCallback((label, value) => {
    if (value && value.trim() !== '') {
      return <p style={{ margin: '0 0 5px 0' }}>{label} <span className="data-placeholder">{value}</span></p>;
    }
    return null;
  }, []);

  const renderWitnessRows = useCallback(() => {
    if (witnesses.filter(w => w.name || w.address).length === 0) {
      return (<tr key="no-witness"><td colSpan="3" style={{ textAlign: 'center' }}>साक्षीदार उपलब्ध नाही</td></tr>);
    }

    return witnesses.map((witness, index) => (
      <tr key={index + 1}>
        <td style={{ textAlign: 'center', width: '5%' }}>{index + 1}</td>
        <td style={{ width: '40%' }}>
          <span className="data-placeholder">{witness.name || '.....................'}</span>
        </td>
        <td style={{ width: '55%' }}>
          <span className="data-placeholder">{witness.address || '.....................'}</span>
        </td>
      </tr>
    ));
  }, [witnesses]);

  const accusedPlaceholder = accusedName || '.....................';
  const lawPlaceholder = lawSection || '.....................';
  const summonDateFormatted = formatDdMmYyyy(summonDate) || '.....................';
  const currentDateFormatted = currentDate || '.....................';
  const courtLocationPlaceholder = courtLocation || '.....................';
  const policeStationPlaceholder = policeStation || '.....................';
  const caseNoPlaceholder = caseNo || '.....................';

  const titleText = useMemo(() => {
    switch (formType) {
      case 'आरोपीस समन्स':
        return 'आरोपीस समन्स';
      case 'सामनेवाला यांस नोटीस':
        return 'सामनेवाला यांस नोटीस';
      case 'साक्षीदारास समन्स':
      default:
        return 'साक्षीदारास समन्स';
    }
  }, [formType]);


  // Content based on Form Type (Pure JSX)
  const mainContent = useMemo(() => {
    const spaceIndent = <span style={{ whiteSpace: 'pre' }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
    const noticeOrSummons = formType === 'आरोपीस समन्स' ? 'समन्स' : 'नोटीस';

    // साक्षीदारास समन्स (Witness Summons)
    if (formType === 'साक्षीदारास समन्स') {
      return (
        <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
          <p className="body-paragraph">
            {spaceIndent}  ज्या अर्थी (आरोपीचे नांव) <span className="data-placeholder">{accusedPlaceholder}</span>  याने कायदा <span className="data-placeholder">{lawPlaceholder}</span>
            प्रमाणे अपराध केला आहे अशी माझ्याकडे फिर्याद देण्यात आली आहे आणि मला असे दिसुन येते की, फिर्यादीपक्षातर्फे तुम्ही महत्वाचा पुरावा देण्याची शक्यता आहे.
          </p>
          <p className="body-paragraph">
            {spaceIndent}  म्हणुन तुम्हाला याव्दारे या न्यायालयापुढे येत्या दिनांक <span className="data-placeholder">{summonDateFormatted}</span> रोजी सकाळी ठिक ११:०० वाजता उक्त फिर्यादीसंबंधाने तुम्हाला जे माहित आहे त्या बद्दल साक्ष देण्यासाठी उपस्थित होण्याचे आणि न्यायालयाचे परवानगीवाचून निघुन न जण्याचे समन्स पाठवण्यात येत आहे.
          </p>
          <p className="body-paragraph">
            {spaceIndent}  या कामी रास्त सबबीशिवाय हयगय केली तर, तुम्हाला हजर राहण्याची सक्ती करण्यासाठी वॉरंट काढले जाईल.
          </p>
        </div>
      );
    } 
    
    // आरोपीस समन्स / सामनेवाला यांस नोंटीस
    return (
      <div style={{ marginTop: '15px', lineHeight: "1.8" }}>
        <p className="body-paragraph">
          {/* {spaceIndent}  ज्या अर्थी **(आरोपीचे नांव)** <span className="data-placeholder">{accusedPlaceholder}</span> याने कायदा <span className="data-placeholder">{lawPlaceholder}</span> प्रमाणे अपराध केला आहे अशी माझ्याकडे फिर्याद देण्यात आली आहे. */}
        {spaceIndent} ज्या अर्थी उक्त आरोपीस/सा.वाला/यांस वरील खटल्यात कायदा <span className="data-placeholder">{lawPlaceholder}</span>  	      मध्ये उत्तर देण्याकरीता तुमची उपस्थिती आवश्यक आहे.  त्याअर्थी तुम्ही न्यायदंडाधिकारी प्रथम वर्ग, मनमाड शहर  यांचे न्यायालयात दिनांक <span className="data-placeholder">{summonDateFormatted}</span>   या दिवशी सकाळी 10:30 वाजता जातीने स्वतः अगर वकीलां मार्फत उपस्थित राहावे.

        
        </p>
        <p className="body-paragraph">
         {spaceIndent} यात कसुर झाल्यास तुमचे विरूध्द पुढील कार्यवाही करणेत येईल याची नोंद घ्यावी.
          {/* {spaceIndent}  म्हणून तुम्हाला याव्दारे या न्यायालयापुढे येत्या दिनांक <span className="data-placeholder">{summonDateFormatted}</span> रोजी सकाळी ठिक ११:०० वाजता उक्त फिर्यादीसंबंधाने हजर राहण्याचे {noticeOrSummons} पाठवण्यात येत आहे. */}
        </p>

         <div style={{ lineHeight: 1.5,  }}>
            {renderCaseNumber('आज दिनांक', currentDateFormatted)}
        </div>
        {/* <p className="body-paragraph">
          {spaceIndent}  या कामी रास्त सबबीशिवाय हयगय केली तर, तुम्हाला हजर राहण्याची सक्ती करण्यासाठी वॉरंट काढले जाईल.
        </p> */}
      </div>
    );

  }, [formType, accusedPlaceholder, lawPlaceholder, summonDateFormatted]);


  return (
    // ⚠️ Note: A4-page class is applied in print styles, not here.
    <div className="a4-page-content" style={{fontSize:"13pt",marginTop:"50px"}}> 
      
      {/* 1. शीर्षक / न्यायालय */}
      <p className="align-center court-title" style={{ fontWeight: "bold", fontSize: "16pt", marginBottom: '5px' }}>
         {court}
         <span className="data-placeholder">{courtLocationPlaceholder}</span> 
      </p>
      <p className="align-center" style={{ marginTop: '0', marginBottom: '15px', fontSize: '11pt' }}>
        (न्यायालय क्रमांक १)
      </p>
      <h2 className="align-center court-slogan" style={{ fontSize: '18pt', margin: '15px 0 25px 0' }}>{titleText}</h2>

      {/* 2. केस क्रमांक आणि तारीख */}
      {/* <div className="case-numbers" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11pt' }}> */}
        <div style={{ lineHeight: 1.5 ,textAlign: 'right'}}>
            {renderCaseNumber(caseLabel, caseNoPlaceholder)}
            {/* {caseType === 'R.C.C.' && renderCaseNumber('S.C.C. No.', '.....................')} */}
        {/* </div> */}
       
      </div>

      {/* 3. प्राप्तकर्ता पत्ता (पोलीस स्टेशन) */}
      <div style={{ marginTop: '10px', marginBottom: '10px', lineHeight: "1.6" }}>
        <p style={{ marginBottom: '0' }}>प्रति,</p>
        <p style={{ marginBottom: '0' }}>पोलीस निरीक्षक,</p>
        <p style={{  marginTop: '0' }}><span className="data-placeholder">{policeStationPlaceholder}</span> पोलीस स्टेशन, यांना बजावणीसाठी अग्रेषीत</p>
      </div>

      {/* 4. साक्षीदारांची यादी (फक्त साक्षीदारास समन्ससाठी) */}
      {formType === 'साक्षीदारास समन्स' ? (
        <div style={{ marginTop: '10px' , }}>
          {/* <h3 className="align-center print-subtitle" style={{ marginTop: '20px', marginBottom: '5px', fontSize: '12pt', fontWeight: 'bold' }}>साक्षीदारांचे नांव</h3> */}
          <table className="witness-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '10pt' }}>
            <thead style={{fontSize:"15px"}}>
              <tr>
                <th style={{ width: '5%', border: '1px solid black', padding: '4px 6px' }}>अ.क्र</th>
                <th style={{ width: '40%', border: '1px solid black', padding: '4px 6px' }}>साक्षीदाराचे नांव</th>
                <th style={{ width: '55%', border: '1px solid black', padding: '4px 6px' }}>राहणार</th>
              </tr>
            </thead >
            <tbody style={{fontSize:"15px"}}>{renderWitnessRows()}</tbody>
          </table>
        </div>
      ):<div style={{ marginTop: '10px' }}>
          {/* <h3 className="align-center print-subtitle" style={{ marginTop: '20px', marginBottom: '5px', fontSize: '12pt', fontWeight: 'bold' }}> आराेपी/सामनेवाला नांव</h3> */}
          <table className="witness-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px', fontSize: '10pt' }}>
            <thead style={{fontSize:"15px"}}>
              <tr>
                <th style={{ width: '5%', border: '1px solid black', padding: '4px 6px' }}>अ.क्र</th>
                <th style={{ width: '40%', border: '1px solid black', padding: '4px 6px' }}>आराेपी/सामनेवाला नांव</th>
                <th style={{ width: '55%', border: '1px solid black', padding: '4px 6px' }}>राहणार</th>
              </tr>
            </thead>
            <tbody style={{fontSize:"15px"}}>{renderWitnessRows()}</tbody>
          </table>
        </div>}

      {/* 5. समन्सचा मुख्य भाग */}
      {mainContent}
      
      {/* 6. तळटीप/स्वाक्षरी ब्लॉक */}
      <div className="footer-section" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '50px' }}>
        <div className="signature-block align-right" style={{ lineHeight: 1.6, width: '40%', textAlign: 'center' }}>
          <p style={{ marginBottom: '0', marginTop: '0' }}>सहाय्यक अधिक्षक</p>
          <p style={{ marginBottom: '0', marginTop: '0' }}>दिवाणी व फौजदारी न्यायालय,</p>
          <p style={{ marginBottom: '0', marginTop: '0' }}><span >{courtLocationPlaceholder}</span> </p>
        </div>
      </div>
    </div>
  );
});

// =================================================================
// SummonsFormApp Component (Main App)
// =================================================================

const SummonsFormApp = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWitnessChange = (index, field, value) => {
    const newWitnesses = formData.witnesses.map((witness, i) => {
      if (i === index) {
        return { ...witness, [field]: value };
      }
      return witness;
    });
    setFormData((prev) => ({ ...prev, witnesses: newWitnesses }));
  };
  
  const handleAddWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', address: '' }]
    }));
  };
  
  const handleFormTypeChange = (type) => {
    setFormData(prev => ({
        ...prev,
        formType: type
    }));
  };

  const handleCaseTypeChange = (type) => {
    setFormData(prev => ({
        ...prev,
        caseType: type,
        caseNo: '' 
    }));
  };

  const caseLabelText = useMemo(() => {
    if (formData.caseType === 'R.C.C.' || formData.caseType === 'S.C.C.') {
      return `${formData.caseType}. No.:`;
    }
    return `${formData.caseType} No.:`;
  }, [formData.caseType]);

  const showWitnesses = formData.formType === 'साक्षीदारास समन्स';

  // =================================================================
  // Print Handler (Adjusted Styles)
  // =================================================================
  const handlePrint = () => {

const getPartyLabel = (formType) => {
  switch (formType) {
    case 'साक्षीदारास समन्स':
      // साक्षीदारास समन्स मध्ये, आपण आरोपीचे नाव 'बनाम' म्हणून वापरतो.
      return 'आरोपीचे नांव'; 
    case 'सामनेवाला यांस नोटीस':
      return 'सामनेवाल्याचे नांव';
    case 'आरोपीस समन्स':
      return 'आरोपीचे नांव';
    default:
      return 'व्यक्तीचे नांव';
  }
};

    const printContent = document.getElementById('print-area').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>कोर्ट दस्तऐवज</title>');
    
    // 🎨 A4 आणि प्रिंटसाठी आवश्यक स्टाईल्स (Layout FIXES Applied)
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @page { size: A4; margin: 15mm 20mm 15mm 20mm; } 
      body { 
          font-family: Arial, "Noto Sans CJK JP", sans-serif; 
          font-size: 11pt;
          line-height: 1.4;
          margin: 0;
          color: #000;
          padding-top: 20px; /* Give some top margin */
      }
      .a4-page-content {
          width: 100%;
          padding: 0;
      }
      .align-center { text-align: center; }
      .align-right { text-align: right; }
      
      /* Header & Title Styles */
      .court-title { 
          font-size: 14pt; 
          margin-bottom: 2px; 
          line-height: 1.2; 
          font-weight: bold;
      }
      .court-slogan { 
          font-size: 20pt; 
          margin: 15px 0 25px 0; /* Increased margin for separation */
          font-weight: bold; 
          border-bottom: 2px solid #000; 
          padding-bottom: 5px;
      }
      .case-numbers { 
          display: flex; 
          justify-content: space-between; 
          margin-top: 10px; /* Adjusted spacing */
          font-size: 11pt; /* Adjusted size */
          line-height: 1.5;
      }
      .party-info { font-size: 11pt; line-height: 1.5; margin-bottom: 15px; }
      .party-line { margin-bottom: 5px; }
      
      /* Body Content Styles */
      .body-paragraph {
          text-align: justify;
          text-indent: 0; /* Removing text-indent for consistent spacing */
          margin-bottom: 12px; /* Increased margin between paragraphs */
          line-height: 1.6; /* Increased line height */
      }
      .body-paragraph span:first-child { /* Targets the JSX span used for indention */
          display: inline-block;
          width: 2em; /* Explicitly defining the indent width */
      }
      .data-placeholder { 
          // text-decoration: underline; 
          font-weight: bold; 
          padding: 0 4px; 
          display: inline-block; 
          min-width: 50px; 
      }
      
      /* Witness Table Styles */
      .print-subtitle { 
          margin-top: 20px !important; 
          margin-bottom: 5px !important; 
          font-size: 12pt;
          font-weight: bold;
          text-align: center;
      }
      .witness-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 5px; 
          font-size: 10pt; 
      }
      .witness-table th, .witness-table td { 
          border: 1px solid black; 
          padding: 4px 6px; 
          vertical-align: top;
      }

      /* Footer Styles */
      .footer-section { 
          margin-top: 50px; /* Increased margin to push to bottom */
          display: flex; 
          justify-content: flex-end; 
          align-items: flex-end; 
          width: 100%;
          font-size: 11pt;
      }
      .signature-block { 
          text-align: center;
          width: 40%;
          line-height: 1.3;
          padding-top: 5px; /* Space above signature lines */
      }
      @media print {
        -webkit-print-color-adjust: exact !important; 
        color-adjust: exact !important;
      }
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.print();
  };
  
  // =================================================================
  // UI Rendering
  // =================================================================
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tailwind and Custom CSS for Form */}
      <style jsx global>{`
        .form-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }
        .input-group input, .input-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
            margin-bottom: 15px;
            font-size: 1rem;
        }
        .radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f9f9f9;
        }
        .radio-group label {
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
        }
        .radio-group input[type="radio"] {
            display: none; /* Hide default radio button */
        }
        .radio-group input[type="radio"]:checked + span {
            background-color: #3b82f6;
            color: white;
            border-color: #2563eb;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .radio-group label > span {
            padding: 8px 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
            display: inline-block;
        }
        .print-button {
            background-color: #10b981;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 20px;
            transition: background-color 0.3s;
        }
        .print-button:hover {
            background-color: #059669;
        }
        .add-button {
            background-color: #f59e0b;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s;
        }
        .add-button:hover {
            background-color: #d97706;
        }
        .witness-input-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .witness-input-table th, .witness-input-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .witness-input-table input {
            width: 100%;
            border: none;
            padding: 0;
            margin: 0;
            outline: none;
        }
      `}</style>
      
      <div className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">कोर्ट दस्तऐवज निर्मिती (Court Document Generator)</h2>
        
        <button onClick={handlePrint} className="print-button">
          प्रिंट करा 🖨️
        </button>

        {/* -------------------------------------- */}
        {/* 1. फॉर्म प्रकार निवड */}
        {/* -------------------------------------- */}
        <h3 className="text-xl font-semibold mt-4 mb-3 text-indigo-700">१. दस्तऐवजाचा प्रकार निवडा</h3>
        <div className="radio-group">
          {['साक्षीदारास समन्स', 'आरोपीस समन्स', 'सामनेवाला यांस नोटीस'].map(type => (
            <label key={type}>
              <input 
                type="radio" 
                name="formType" 
                value={type} 
                checked={formData.formType === type}
                onChange={() => handleFormTypeChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {/* -------------------------------------- */}
        {/* 2. केस प्रकार निवड */}
        {/* -------------------------------------- */}
        <h3 className="text-xl font-semibold mt-4 mb-3 text-indigo-700">२. केसचा प्रकार निवडा</h3>
        <div className="radio-group">
          {['R.C.C.', 'Cri M.A.', 'D.V.', 'S.C.C.'].map(type => (
            <label key={type}>
              <input 
                type="radio" 
                name="caseType" 
                value={type} 
                checked={formData.caseType === type}
                onChange={() => handleCaseTypeChange(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>


        <h3 className="text-xl font-semibold mt-6 mb-4 text-green-700">३. मूलभूत माहिती भरा</h3>

        {/* न्यायालय आणि ठिकाणे */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
                <label>न्यायालय (उदा: न्यायदंडाधिकारी प्रथमवर्ग,):</label>
                <input type="text" name="court" value={formData.court} onChange={handleInputChange} placeholder="न्यायदंडाधिकारी प्रथमवर्ग," />
            </div>
            <div className="input-group">
                <label>न्यायालयाचे ठिकाण:</label>
                <input type="text" name="courtLocation" value={formData.courtLocation} onChange={handleInputChange} placeholder="मनमाड शहर" />
            </div>
        </div>
        <div className="input-group">
          <label>पोलीस स्टेशनचे ठिकाण:</label>
          <input type="text" name="policeStation" value={formData.policeStation} onChange={handleInputChange} placeholder="मनमाड शहर पोलीस स्टेशन" />
        </div>


        {/* केस क्रमांक */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label>{caseLabelText} (क्रमांक):</label>
              <input type="text" name="caseNo" value={formData.caseNo} onChange={handleInputChange} placeholder="केस क्रमांक / Case Number" />
            </div>
             <div className="input-group">
                <label>समन्सची तारीख (दिनांक):</label>
                <input type="date" name="summonDate" value={formData.summonDate} onChange={handleInputChange} />
            </div>
        </div>


        {/* आरोपी आणि कलम */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.formType === 'साक्षीदारास समन्स' && 
            <div className="input-group">
                <label>{formData.formType === 'साक्षीदारास समन्स' ? 'आरोपीचे नांव' : 'आरोपीचे/सामनेवाल्याचे नांव'}:</label>
                <input type="text" name="accusedName" value={formData.accusedName} onChange={handleInputChange} placeholder="पूर्ण नांव" />
            </div>
            }
            <div className="input-group">
                <label>कायदा/कलम:</label>
                <input type="text" name="lawSection" value={formData.lawSection} onChange={handleInputChange} placeholder="उदा: IPC कलम 323, 504" />
            </div>
        </div>

        {/* साक्षदार यादी (साक्षीदारास समन्ससाठीच) */}
        {/* {showWitnesses && ( */}
        
          <>
            <h3 className="text-xl font-semibold mt-6 mb-4 text-purple-700">४. {formData.formType} नांव</h3>
            <table className="witness-input-table">
              <thead>
                <tr>
                  <th style={{width: '10%'}}>अ.क्र</th>
                  <th style={{width: '45%'}}>{formData.formType } नांव</th>
                  <th style={{width: '45%'}}>राहणार (पत्ता)</th>
                </tr>
              </thead>
              <tbody>
                {formData.witnesses.map((witness, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={witness.name}
                        onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                        placeholder="साक्षीदाराचे नांव"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={witness.address}
                        onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                        placeholder="पत्ता"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button onClick={handleAddWitness} className="add-button">
              + साक्षदार जोडा
            </button>
          </>
        {/* )} */}
        
        {/* आजची तारीख */}
        <div className="input-group" style={{marginTop: '30px'}}>
          <label>आजची तारीख (दिनांक - DD/MM/YYYY):</label>
          <input 
              type="text" 
              name="currentDate" 
              value={formData.currentDate} 
              onChange={handleInputChange} 
              placeholder="DD/MM/YYYY"
          />
        </div>


        {/* प्रिंटसाठी लपवलेला भाग - येथे PrintLayout वापरला जातो */}
        <div id="print-area" style={{ display: 'none' }}>
          <PrintLayout data={formData} />
        </div>
      </div>
    </div>
  );
};

export default SummonsFormApp;
