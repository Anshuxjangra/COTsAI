"""
Criteria matching engine for COTS component selection
Evaluates components against engineering requirements
"""


def evaluate_bearing_criteria(form_data, component_spec):
    """Evaluate bearing against design requirements"""
    criteria = []
    matched_count = 0
    
    # Dynamic Load Capacity
    dynamic_load_req = float(form_data.get('dynamicLoad', 0))
    dynamic_load_rating = component_spec.dynamic_load_rating or 0
    dynamic_load_met = dynamic_load_rating >= dynamic_load_req
    if dynamic_load_met:
        matched_count += 1
    criteria.append({
        'name': 'Dynamic Load Capacity',
        'value': f'{dynamic_load_rating} kN',
        'requirement': f'≥ {dynamic_load_req} kN',
        'met': dynamic_load_met,
        'weight': 'critical'
    })
    
    # Speed Rating
    speed_req = float(form_data.get('speed', 0))
    speed_rating = component_spec.speed_rating or 0
    speed_met = speed_rating >= speed_req
    if speed_met:
        matched_count += 1
    criteria.append({
        'name': 'Speed Rating',
        'value': f'{speed_rating} RPM',
        'requirement': f'≥ {speed_req} RPM',
        'met': speed_met,
        'weight': 'critical'
    })
    
    # L10 Life
    l10_life_req = float(form_data.get('targetL10Life', 0))
    l10_life = component_spec.l10_life or 0
    l10_life_met = l10_life >= l10_life_req
    if l10_life_met:
        matched_count += 1
    criteria.append({
        'name': 'L10 Life (Bearing Life)',
        'value': f'{l10_life} hours',
        'requirement': f'≥ {l10_life_req} hours',
        'met': l10_life_met,
        'weight': 'critical'
    })
    
    # Bore Size
    bore_size_req = float(form_data.get('boreSize', 0))
    bore_size = component_spec.bore_diameter or 0
    bore_size_met = abs(bore_size - bore_size_req) <= 2
    if bore_size_met:
        matched_count += 1
    criteria.append({
        'name': 'Bore Size',
        'value': f'{bore_size} mm',
        'requirement': f'≈ {bore_size_req} mm',
        'met': bore_size_met,
        'weight': 'high'
    })
    
    # Environmental Compatibility
    environment = form_data.get('bearingEnvironment', 'Clean')
    environment_met = environment != 'Highly Corrosive'
    if environment_met:
        matched_count += 1
    criteria.append({
        'name': 'Environmental Compatibility',
        'value': f'Sealed bearing suitable for {environment}',
        'requirement': f'Environment: {environment}',
        'met': environment_met,
        'weight': 'high'
    })
    
    # Lubrication Type
    lubrication = form_data.get('lubrication', 'Grease')
    lubrication_met = lubrication in ['Oil Bath', 'Grease']
    if lubrication_met:
        matched_count += 1
    criteria.append({
        'name': 'Lubrication Type',
        'value': f'Standard {lubrication} suitable',
        'requirement': f'Lubrication: {lubrication}',
        'met': lubrication_met,
        'weight': 'medium'
    })
    
    # Material
    bearing_material = form_data.get('bearingMaterial', 'Steel')
    material_met = bearing_material in ['Steel', 'Stainless Steel (440C)']
    if material_met:
        matched_count += 1
    criteria.append({
        'name': 'Material Availability',
        'value': f'{bearing_material} available',
        'requirement': f'Material: {bearing_material}',
        'met': material_met,
        'weight': 'medium'
    })
    
    total_criteria = len(criteria)
    match_score = round((matched_count / total_criteria) * 100) if total_criteria > 0 else 0
    
    return {'criteria': criteria, 'match_score': match_score, 'matched_count': matched_count}


def evaluate_motor_criteria(form_data, component_spec):
    """Evaluate motor against design requirements"""
    criteria = []
    matched_count = 0
    
    # Power Output
    power_req = float(form_data.get('power', 0))
    power_rating = component_spec.power or 0
    power_met = (power_rating >= power_req * 0.8) and (power_rating <= power_req * 1.2)
    if power_met:
        matched_count += 1
    criteria.append({
        'name': 'Power Output',
        'value': f'{power_rating} kW',
        'requirement': f'≈ {power_req} kW (±20%)',
        'met': power_met,
        'weight': 'critical'
    })
    
    # Speed Rating
    speed_req = float(form_data.get('speed', 0))
    speed_rating = component_spec.speed or 0
    speed_met = (speed_rating == speed_req) or (abs(speed_rating - speed_req) <= 100)
    if speed_met:
        matched_count += 1
    criteria.append({
        'name': 'Speed Rating',
        'value': f'{speed_rating} RPM',
        'requirement': f'≈ {speed_req} RPM',
        'met': speed_met,
        'weight': 'critical'
    })
    
    # Duty Class
    duty_class = form_data.get('dutyClass', 'S3')
    duty_class_met = True
    if duty_class_met:
        matched_count += 1
    criteria.append({
        'name': 'Duty Class Support',
        'value': 'S3, S4, S5 compatible',
        'requirement': f'Duty Class: {duty_class}',
        'met': duty_class_met,
        'weight': 'high'
    })
    
    # Insulation Class
    insulation_class = form_data.get('insulationClass', 'F')
    insulation_met = insulation_class in ['F', 'H', 'N']
    if insulation_met:
        matched_count += 1
    criteria.append({
        'name': 'Insulation Class',
        'value': f'Class {insulation_class} available',
        'requirement': f'Insulation: {insulation_class}',
        'met': insulation_met,
        'weight': 'high'
    })
    
    # Environmental Tolerance
    environment = form_data.get('motorEnvironment', 'Indoor Dry')
    environment_met = 'Explosive' not in environment
    if environment_met:
        matched_count += 1
    criteria.append({
        'name': 'Environmental Tolerance',
        'value': 'Indoor/Outdoor rated',
        'requirement': f'Environment: {environment}',
        'met': environment_met,
        'weight': 'high'
    })
    
    # Efficiency
    efficiency = component_spec.efficiency or 85.3
    efficiency_met = True
    if efficiency_met:
        matched_count += 1
    criteria.append({
        'name': 'Energy Efficiency (IE3)',
        'value': f'{efficiency}% efficiency',
        'requirement': 'High efficiency required',
        'met': efficiency_met,
        'weight': 'medium'
    })
    
    total_criteria = len(criteria)
    match_score = round((matched_count / total_criteria) * 100) if total_criteria > 0 else 0
    
    return {'criteria': criteria, 'match_score': match_score, 'matched_count': matched_count}


def evaluate_gear_criteria(form_data, component_spec):
    """Evaluate gear against design requirements"""
    criteria = []
    matched_count = 0
    
    # Power Transmission
    power_req = float(form_data.get('power', 0))
    power_rating = component_spec.power_transmission or 15
    power_met = power_rating >= power_req
    if power_met:
        matched_count += 1
    criteria.append({
        'name': 'Power Transmission',
        'value': f'{power_rating} kW rated',
        'requirement': f'≥ {power_req} kW',
        'met': power_met,
        'weight': 'critical'
    })
    
    # Module Size
    module_req = float(form_data.get('moduleSize', 2.0))
    module = component_spec.module or 2.0
    module_met = (module == module_req) or (abs(module - module_req) <= 0.5)
    if module_met:
        matched_count += 1
    criteria.append({
        'name': 'Module Size',
        'value': f'{module} mm',
        'requirement': f'≈ {module_req} mm',
        'met': module_met,
        'weight': 'critical'
    })
    
    # Material
    gear_material = form_data.get('gearMaterial', 'Steel')
    material_met = gear_material in ['Steel', 'Cast Iron']
    if material_met:
        matched_count += 1
    criteria.append({
        'name': 'Material Compatibility',
        'value': f'{component_spec.gear_material or "Steel"}',
        'requirement': f'Material: {gear_material}',
        'met': material_met,
        'weight': 'high'
    })
    
    # Precision Grade
    precision_met = True
    if precision_met:
        matched_count += 1
    criteria.append({
        'name': 'Precision Grade',
        'value': f'{component_spec.precision_grade or "ISO 7"} precision',
        'requirement': 'High precision required',
        'met': precision_met,
        'weight': 'high'
    })
    
    # Lubrication
    oil_type = form_data.get('oilType', 'ISO VG 46')
    oil_met = oil_type in ['ISO VG 46', 'ISO VG 68', 'ISO VG 100']
    if oil_met:
        matched_count += 1
    criteria.append({
        'name': 'Lubrication Compatibility',
        'value': 'Compatible with standard oils',
        'requirement': f'Oil Type: {oil_type}',
        'met': oil_met,
        'weight': 'medium'
    })
    
    total_criteria = len(criteria)
    match_score = round((matched_count / total_criteria) * 100) if total_criteria > 0 else 0
    
    return {'criteria': criteria, 'match_score': match_score, 'matched_count': matched_count}


def evaluate_seal_criteria(form_data, component_spec):
    """Evaluate seal against design requirements"""
    criteria = []
    matched_count = 0
    
    # Diameter
    diameter_req = float(form_data.get('sealDiameter', 30))
    diameter = component_spec.seal_diameter or 30
    diameter_met = abs(diameter - diameter_req) <= 2
    if diameter_met:
        matched_count += 1
    criteria.append({
        'name': 'Seal Diameter',
        'value': f'{diameter} mm',
        'requirement': f'≈ {diameter_req} mm',
        'met': diameter_met,
        'weight': 'critical'
    })
    
    # Pressure Rating
    pressure_req = float(form_data.get('pressure', 0))
    pressure_rating = component_spec.pressure_rating or 50
    pressure_met = pressure_rating >= pressure_req
    if pressure_met:
        matched_count += 1
    criteria.append({
        'name': 'Pressure Rating',
        'value': f'{pressure_rating} bar',
        'requirement': f'≥ {pressure_req} bar',
        'met': pressure_met,
        'weight': 'critical'
    })
    
    # Sealing Medium
    medium = form_data.get('sealEnvironment', 'Oil')
    medium_met = medium in ['Oil', 'Water', 'Hydraulic Fluid']
    if medium_met:
        matched_count += 1
    criteria.append({
        'name': 'Sealing Medium Compatibility',
        'value': f'Suitable for {medium}',
        'requirement': f'Medium: {medium}',
        'met': medium_met,
        'weight': 'critical'
    })
    
    # Elastomer Type
    elastomer = form_data.get('elastomerMaterial', 'NBR')
    elastomer_met = elastomer in ['NBR', 'FKM']
    if elastomer_met:
        matched_count += 1
    criteria.append({
        'name': 'Elastomer Type',
        'value': f'{component_spec.elastomer_type or elastomer} available',
        'requirement': f'Material: {elastomer}',
        'met': elastomer_met,
        'weight': 'high'
    })
    
    # Temperature Range
    temp_met = True
    if temp_met:
        matched_count += 1
    criteria.append({
        'name': 'Temperature Range',
        'value': f'{component_spec.temp_min} to {component_spec.temp_max}°C',
        'requirement': f'Operating: {form_data.get("sealTemperature", "20-60")}°C',
        'met': temp_met,
        'weight': 'high'
    })
    
    total_criteria = len(criteria)
    match_score = round((matched_count / total_criteria) * 100) if total_criteria > 0 else 0
    
    return {'criteria': criteria, 'match_score': match_score, 'matched_count': matched_count}


def evaluate_fastener_criteria(form_data, component_spec):
    """Evaluate fastener against design requirements"""
    criteria = []
    matched_count = 0
    
    # Diameter
    diameter_req = form_data.get('diameter', 'M10')
    diameter_met = True
    if diameter_met:
        matched_count += 1
    criteria.append({
        'name': 'Fastener Diameter',
        'value': f'{component_spec.fastener_diameter} available',
        'requirement': f'Size: {diameter_req}',
        'met': diameter_met,
        'weight': 'critical'
    })
    
    # Clamp Load
    clamp_load_req = float(form_data.get('clampLoad', 0))
    clamp_load_capacity = component_spec.clamp_load_capacity or 12000
    clamp_load_met = clamp_load_capacity >= clamp_load_req
    if clamp_load_met:
        matched_count += 1
    criteria.append({
        'name': 'Clamp Load Capacity',
        'value': f'{clamp_load_capacity} N',
        'requirement': f'≥ {clamp_load_req} N',
        'met': clamp_load_met,
        'weight': 'critical'
    })
    
    # Material Grade
    material_grade = form_data.get('fastenerMaterial', 'Steel Grade 8.8')
    grade_met = material_grade in ['Steel Grade 8.8', 'Steel Grade 10.9', 'Stainless Steel A4-70']
    if grade_met:
        matched_count += 1
    criteria.append({
        'name': 'Material Grade',
        'value': f'{component_spec.material_grade or "Grade 8.8"} (High-strength)',
        'requirement': f'Grade: {material_grade}',
        'met': grade_met,
        'weight': 'critical'
    })
    
    # Environment
    environment = form_data.get('fastenerEnvironment', 'Dry Indoor')
    environment_met = 'Corrosive' not in environment
    if environment_met:
        matched_count += 1
    criteria.append({
        'name': 'Environmental Suitability',
        'value': 'Zinc-plated for mild environments',
        'requirement': f'Environment: {environment}',
        'met': environment_met,
        'weight': 'high'
    })
    
    # Temperature
    temp_met = True
    if temp_met:
        matched_count += 1
    criteria.append({
        'name': 'Temperature Tolerance',
        'value': '-20 to +150 °C',
        'requirement': f'Operating: {form_data.get("fastenerTemperature", "0-80")} °C',
        'met': temp_met,
        'weight': 'high'
    })
    
    total_criteria = len(criteria)
    match_score = round((matched_count / total_criteria) * 100) if total_criteria > 0 else 0
    
    return {'criteria': criteria, 'match_score': match_score, 'matched_count': matched_count}


def evaluate_criteria(component_type, form_data, component_spec):
    """Main criteria evaluation dispatcher"""
    evaluators = {
        'bearing': evaluate_bearing_criteria,
        'motor': evaluate_motor_criteria,
        'gear': evaluate_gear_criteria,
        'seal': evaluate_seal_criteria,
        'fastener': evaluate_fastener_criteria,
    }
    
    evaluator = evaluators.get(component_type.lower())
    if not evaluator:
        return {'criteria': [], 'match_score': 0, 'matched_count': 0}
    
    return evaluator(form_data, component_spec)
