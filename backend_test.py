#!/usr/bin/env python3
"""
Backend Test Suite for SUPER BARREIRAS - Sistema de Análise de Operações do Banco do Brasil
Tests all API endpoints with comprehensive validation
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=')[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"

print(f"Testing backend at: {API_URL}")

# Test data as provided in the request
TEST_DATA = {
    "prefixo": "001",
    "agencia": "1234-5",
    "alcada": "Regional",
    "mci": "MCI-123",
    "cliente": "João da Silva Agricultura LTDA",
    "idadeCliente": "45",
    "clienteDesde": "2015-03-20",
    "proposta": "PROP-2025-001",
    "linhaCredito": "Custeio Agrícola",
    "itemFinanciado": "Plantio de Soja",
    "rating": "A",
    "autorizacaoGrao": "Autorização concedida em 15/01/2025",
    "valorOperacao": "500.000,00",
    "seguros": "Seguro Rural + Seguro de Vida",
    "rsContratado": "50.000,00",
    "limiteCredito": "1.000.000,00 - Vigência 12 meses",
    "condicionanteLC": "Apresentação de garantia hipotecária",
    "receitaBrutaClientes": "800.000,00",
    "receitaBrutaObtida": "750.000,00",
    "receitaBrutaPrevista": "850.000,00",
    "resultadoObtido": "200.000,00",
    "resultadoPrevisto": "250.000,00",
    "pecuariaCompativel": "sim",
    "justifique": "Cliente possui 100 hectares para 50 cabeças de gado",
    "garantias": "Hipoteca de imóvel rural - Matrícula 12345",
    "recursosLiquidos": "300.000,00",
    "patrimonioTotal": "2.500.000,00",
    "endividamentoSFN": "1.000.000,00",
    "endividamentoBB": "600.000,00",
    "inadAgroAgencia": "0,00",
    "propostaCustomizada": "nao",
    "percentualGarantiaHipotecaria": "85%",
    "rendeFacil": "sim",
    "shareBB": "60,00"
}

# Global variable to store created operation ID
created_operation_id = None

def test_health_check():
    """Test API health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            if "message" in data and "status" in data:
                print("✅ Health check PASSED")
                return True
            else:
                print("❌ Health check response missing required fields")
                return False
        else:
            print(f"❌ Health check FAILED - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check ERROR: {e}")
        return False

def test_create_operacao():
    """Test POST /api/operacoes - Create new operation"""
    global created_operation_id
    print("\n=== Testing Create Operation ===")
    
    try:
        response = requests.post(
            f"{API_URL}/operacoes",
            json=TEST_DATA,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if response has required fields
            if "id" in data and "createdAt" in data:
                created_operation_id = data["id"]
                print(f"✅ Operation created successfully with ID: {created_operation_id}")
                
                # Verify shareBB is saved correctly
                if data.get("shareBB") == TEST_DATA["shareBB"]:
                    print("✅ shareBB field saved correctly")
                else:
                    print(f"⚠️ shareBB mismatch - Expected: {TEST_DATA['shareBB']}, Got: {data.get('shareBB')}")
                
                # Verify other key fields
                key_fields = ["cliente", "proposta", "valorOperacao", "agencia"]
                for field in key_fields:
                    if data.get(field) == TEST_DATA[field]:
                        print(f"✅ {field} saved correctly")
                    else:
                        print(f"❌ {field} mismatch - Expected: {TEST_DATA[field]}, Got: {data.get(field)}")
                
                return True
            else:
                print("❌ Create operation FAILED - Missing required fields in response")
                return False
        else:
            print(f"❌ Create operation FAILED - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Create operation ERROR: {e}")
        return False

def test_get_all_operacoes():
    """Test GET /api/operacoes - List all operations"""
    print("\n=== Testing Get All Operations ===")
    
    try:
        response = requests.get(f"{API_URL}/operacoes")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of operations returned: {len(data)}")
            
            if isinstance(data, list):
                print("✅ Response is array format")
                
                # Check if our created operation appears in the list
                if created_operation_id:
                    found = any(op.get("id") == created_operation_id for op in data)
                    if found:
                        print("✅ Created operation appears in list")
                    else:
                        print("❌ Created operation NOT found in list")
                        return False
                
                return True
            else:
                print("❌ Response is not an array")
                return False
        else:
            print(f"❌ Get all operations FAILED - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get all operations ERROR: {e}")
        return False

def test_get_specific_operacao():
    """Test GET /api/operacoes/{id} - Get specific operation"""
    print("\n=== Testing Get Specific Operation ===")
    
    if not created_operation_id:
        print("❌ No operation ID available for testing")
        return False
    
    try:
        response = requests.get(f"{API_URL}/operacoes/{created_operation_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Retrieved operation ID: {data.get('id')}")
            
            # Verify it's the correct operation
            if data.get("id") == created_operation_id:
                print("✅ Correct operation retrieved")
                
                # Verify key data fields
                key_fields = ["cliente", "proposta", "valorOperacao", "shareBB"]
                all_correct = True
                for field in key_fields:
                    if data.get(field) == TEST_DATA[field]:
                        print(f"✅ {field} matches original data")
                    else:
                        print(f"❌ {field} mismatch - Expected: {TEST_DATA[field]}, Got: {data.get(field)}")
                        all_correct = False
                
                return all_correct
            else:
                print("❌ Wrong operation retrieved")
                return False
        else:
            print(f"❌ Get specific operation FAILED - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get specific operation ERROR: {e}")
        return False

def test_update_operacao():
    """Test PUT /api/operacoes/{id} - Update operation"""
    print("\n=== Testing Update Operation ===")
    
    if not created_operation_id:
        print("❌ No operation ID available for testing")
        return False
    
    # Modify some fields for update
    update_data = TEST_DATA.copy()
    update_data["valorOperacao"] = "750.000,00"
    update_data["rating"] = "B"
    update_data["shareBB"] = "65,00"
    
    try:
        response = requests.put(
            f"{API_URL}/operacoes/{created_operation_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Operation updated successfully")
            
            # Verify updated fields
            updated_fields = ["valorOperacao", "rating", "shareBB"]
            all_correct = True
            for field in updated_fields:
                if data.get(field) == update_data[field]:
                    print(f"✅ {field} updated correctly to: {data.get(field)}")
                else:
                    print(f"❌ {field} update failed - Expected: {update_data[field]}, Got: {data.get(field)}")
                    all_correct = False
            
            # Verify updatedAt field was set
            if "updatedAt" in data:
                print("✅ updatedAt field is present")
            else:
                print("⚠️ updatedAt field missing")
            
            return all_correct
        else:
            print(f"❌ Update operation FAILED - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Update operation ERROR: {e}")
        return False

def test_delete_operacao():
    """Test DELETE /api/operacoes/{id} - Delete operation"""
    print("\n=== Testing Delete Operation ===")
    
    if not created_operation_id:
        print("❌ No operation ID available for testing")
        return False
    
    try:
        response = requests.delete(f"{API_URL}/operacoes/{created_operation_id}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Delete response: {data}")
            
            if "message" in data and data.get("id") == created_operation_id:
                print("✅ Operation deleted successfully")
                
                # Verify operation is actually deleted by trying to get it
                verify_response = requests.get(f"{API_URL}/operacoes/{created_operation_id}")
                if verify_response.status_code == 404:
                    print("✅ Operation confirmed deleted (404 on GET)")
                    return True
                else:
                    print(f"❌ Operation still exists after delete (Status: {verify_response.status_code})")
                    return False
            else:
                print("❌ Delete response format incorrect")
                return False
        else:
            print(f"❌ Delete operation FAILED - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Delete operation ERROR: {e}")
        return False

def run_all_tests():
    """Run all backend tests in sequence"""
    print("🚀 Starting SUPER BARREIRAS Backend API Tests")
    print(f"Backend URL: {API_URL}")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health_check),
        ("Create Operation", test_create_operacao),
        ("Get All Operations", test_get_all_operacoes),
        ("Get Specific Operation", test_get_specific_operacao),
        ("Update Operation", test_update_operacao),
        ("Delete Operation", test_delete_operacao)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ {test_name} CRASHED: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print("⚠️ SOME TESTS FAILED!")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)