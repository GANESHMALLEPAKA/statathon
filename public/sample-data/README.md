# SafeData Pipeline - Sample Datasets

This folder contains sample datasets for testing the SafeData Pipeline prototype.

## Files Included

### 1. household_survey_2024.csv
**Main microdata file for analysis**
- **Records**: 100 sample households
- **Columns**: 14 attributes including demographics, geographic, economic, and household data
- **Coverage**: Represents diverse Indian population across all states and union territories
- **Mix**: 50 urban records (1-50) and 50 rural records (51-100)

**Column Descriptions:**
- `ID`: Unique record identifier
- `Age`: Age of household head (24-62 years)
- `Gender`: Male/Female
- `State`: Indian state/union territory
- `District`: District within the state
- `Urban_Rural`: Urban or Rural classification
- `Education`: Education level (Primary, Higher Secondary, Graduate, Post Graduate)
- `Occupation`: Job category or employment type
- `Income_Bracket`: Monthly household income ranges
- `Employment_Status`: Employed, Self Employed, or Unemployed
- `Family_Size`: Number of family members (2-8)
- `Housing_Type`: Type of housing (Apartment, Independent House, Kutcha House, etc.)
- `Religion`: Religious affiliation
- `Caste_Category`: Social category (General, OBC, SC, ST)

### 2. ground_truth_identifiers.csv
**Sensitive identifier file (for risk assessment simulation)**
- **Purpose**: Simulates external dataset for linkage attack testing
- **Contains**: Direct identifiers that should NOT be present in released microdata
- **Columns**: Full names, phone numbers, email addresses, Aadhaar numbers, PAN numbers, addresses, and pin codes

**⚠️ Important**: This file represents the type of external data that attackers might use for re-identification. In real scenarios, this data would come from data breaches, public records, or other sources.

## How to Use

### Step 1: Upload Main Dataset
1. Go to the SafeData Pipeline dashboard
2. Upload `household_survey_2024.csv` using the file upload interface
3. The system will automatically detect potential quasi-identifiers

### Step 2: Risk Assessment
1. Navigate to the "Risk Assessment" tab
2. Select quasi-identifiers like Age, District, Education, Occupation
3. Run the risk analysis to see vulnerability metrics
4. Review risk heatmaps and distribution charts

### Step 3: Privacy Enhancement
1. Go to "Privacy Enhancement" tab
2. Choose from three techniques:
   - **Statistical Disclosure Control (SDC)**: Traditional privacy methods
   - **Differential Privacy (DP)**: Mathematical privacy guarantees
   - **Synthetic Data Generation (SDG)**: Generate synthetic datasets
3. Configure parameters and process the data

### Step 4: Utility Measurement
1. Navigate to "Utility Measurement" tab
2. Compare original vs. processed data
3. Review statistical accuracy metrics
4. Analyze correlation preservation

### Step 5: Generate Reports
1. Go to "Reports" tab
2. Generate comprehensive analysis reports
3. Download DPDP Act compliance documentation

## Data Characteristics

### Geographic Distribution
- **Urban Areas**: Major cities like Mumbai, Delhi, Bangalore, Chennai
- **Rural Areas**: Villages across different states
- **Regional Diversity**: All major states and union territories represented

### Demographic Diversity
- **Age Range**: 24-62 years (working age population)
- **Gender**: Balanced male/female representation
- **Education**: From primary to post-graduate levels
- **Income**: Wide range from ₹0-15,000 to ₹100,000-150,000 monthly

### Risk Scenarios
The dataset includes various risk scenarios:
- **High-risk records**: Unique combinations of age, location, and occupation
- **Medium-risk records**: Some identifying characteristics
- **Low-risk records**: Common demographic combinations

### Privacy Challenges
- **Quasi-identifiers**: Age, gender, location, education, occupation
- **Sensitive attributes**: Income, caste category, religion
- **Linkage risks**: Potential matches with external datasets

## Expected Results

### Risk Assessment
- **Overall Risk**: ~68% (high risk scenario)
- **High-risk Records**: ~1,247 out of 50,000 (scaled simulation)
- **K-anonymity**: ~3.2 (below recommended threshold of 5)
- **Vulnerable Fields**: Age, District, Education, Occupation

### Privacy Enhancement Impact
- **SDC**: 23-30% risk reduction, 94% utility preservation
- **Differential Privacy**: 40-50% risk reduction, 89% utility preservation
- **Synthetic Data**: 60-70% risk reduction, 85% utility preservation

### Utility Metrics
- **Statistical Accuracy**: 85-95% depending on technique
- **Correlation Preservation**: 85-95%
- **Distribution Similarity**: 80-95%

## Testing Scenarios

### Scenario 1: Basic Risk Assessment
Upload the main dataset and run risk assessment with default quasi-identifiers.

### Scenario 2: SDC Application
Apply statistical disclosure control with moderate parameters and measure utility impact.

### Scenario 3: Differential Privacy
Test different epsilon values (0.1, 1.0, 5.0) and observe privacy-utility trade-offs.

### Scenario 4: Synthetic Data Generation
Generate synthetic dataset and validate statistical properties.

### Scenario 5: Comprehensive Analysis
Run complete pipeline from risk assessment to final reporting.

## Notes for Developers

- All data is synthetic and created for demonstration purposes
- Real NSO datasets would be much larger (50,000+ records)
- Privacy parameters are calibrated for demonstration, not production use
- The ground truth file simulates external attack scenarios

## DPDP Act 2023 Compliance

This sample data helps demonstrate compliance with:
- **Purpose Limitation**: Data used only for statistical analysis
- **Data Minimization**: Only necessary attributes included
- **Technical Safeguards**: Privacy enhancement techniques applied
- **Individual Privacy**: Re-identification risks mitigated
- **Transparency**: Clear documentation of processing methods