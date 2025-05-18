from flask import Flask, request, jsonify
from rdkit import Chem
from rdkit.Chem import Descriptors

app = Flask(__name__)

@app.route('/smiles/process', methods=['POST'])
def process_smiles():
    """
    Accepts a SMILES string in a JSON payload, validates it,
    and returns its canonical SMILES and molecular weight.
    Expected JSON input: {"smiles": "CCO"}
    """
    try:
        data = request.get_json()
        if not data or 'smiles' not in data:
            return jsonify({"status": "error", "message": "Missing 'smiles' in JSON payload."}), 400

        smiles_input = data['smiles']
        mol = Chem.MolFromSmiles(smiles_input)

        if mol is None:
            return jsonify({"status": "error", "message": f"Invalid SMILES string: {smiles_input}"}), 400

        # Generate canonical SMILES
        canonical_smiles = Chem.MolToSmiles(mol, isomericSmiles=True, canonical=True)
        
        # Calculate molecular weight
        mol_weight = Descriptors.MolWt(mol)

        return jsonify({
            "status": "success",
            "input_smiles": smiles_input,
            "canonical_smiles": canonical_smiles,
            "molecular_weight": mol_weight
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Runs the Flask app on http://localhost:5000
    # You can change the port if 5000 is already in use.
    app.run(host='0.0.0.0', port=5000, debug=True) 