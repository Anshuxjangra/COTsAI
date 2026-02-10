"""
CSV generation for component specifications and BOM
"""
from datetime import datetime


def generate_specs_csv(data):
    """Generate specifications CSV from component data"""
    component_name = data.get('componentName', 'Component')
    manufacturer = data.get('manufacturer', 'Unknown')
    specifications = data.get('specifications', [])
    criteria_matches = data.get('criteriaMatches', [])
    performance_metrics = data.get('performanceMetrics', [])
    component_type = data.get('componentType', 'unknown')
    
    csv_lines = [
        "COMPONENT SPECIFICATION SHEET",
        f"Date Generated,{datetime.now().isoformat()}",
        "",
        "COMPONENT INFORMATION",
        f"Component Name,{component_name}",
        f"Manufacturer,{manufacturer}",
        f"Component Type,{component_type}",
        "",
        "SPECIFICATIONS",
    ]
    
    # Add specifications
    for spec in specifications:
        csv_lines.append(f"{spec}")
    
    csv_lines.extend(["", "CRITERIA MATCHING RESULTS"])
    csv_lines.append("Criteria Name,Status,Your Value,Requirement,Weight")
    
    # Add criteria matches
    for criteria in criteria_matches:
        status = "MET" if criteria.get('met') else "NOT MET"
        name = criteria.get('name', '')
        value = criteria.get('value', '')
        requirement = criteria.get('requirement', '')
        weight = criteria.get('weight', '').upper()
        
        csv_lines.append(f'"{name}",{status},"{value}","{requirement}",{weight}')
    
    csv_lines.extend(["", "PERFORMANCE METRICS"])
    csv_lines.append("Metric,Actual Value,Target Value,Status")
    
    # Add performance metrics
    for metric in performance_metrics:
        status = "MET" if metric.get('met') else "CLOSE"
        label = metric.get('label', '')
        value = metric.get('value', '')
        target = metric.get('target', '')
        
        csv_lines.append(f'"{label}","{value}","{target}",{status}')
    
    return '\n'.join(csv_lines)


def generate_bom_csv(data):
    """Generate Bill of Materials CSV"""
    project_name = data.get('projectName', 'Project')
    components = data.get('components', [])
    
    csv_lines = [
        "BILL OF MATERIALS (BOM)",
        f"Project,{project_name}",
        f"Date Generated,{datetime.now().isoformat()}",
        f"Total Components,{len(components)}",
        "",
        "Item #,Component Name,Manufacturer,Part Number,Qty,Unit Price,Total Price,Availability,Lead Time,Vendor URL",
    ]
    
    total_price = 0
    
    for idx, component in enumerate(components, 1):
        name = component.get('name', '')
        manufacturer = component.get('manufacturer', '')
        part_number = component.get('partNumber', 'N/A')
        quantity = component.get('quantity', 1)
        price = component.get('price', 'N/A')
        availability = component.get('availability', 'Check Vendor')
        lead_time = component.get('leadTime', 'N/A')
        vendor_url = component.get('vendorUrl', 'N/A')
        
        # Parse price for total calculation
        try:
            if isinstance(price, str) and '-' in price:
                # Handle price range like "$25-35"
                price_num = float(price.split('-')[0].replace('$', '').strip())
            else:
                price_num = float(str(price).replace('$', '').strip())
            
            item_total = price_num * quantity
            total_price += item_total
        except (ValueError, AttributeError):
            item_total = 'N/A'
        
        csv_lines.append(
            f'{idx},"{name}","{manufacturer}","{part_number}",{quantity},'
            f'"{price}","{item_total}","{availability}","{lead_time}","{vendor_url}"'
        )
    
    csv_lines.append(f'"),"Total Estimated Cost","","","",{total_price}')
    
    return '\n'.join(csv_lines)


def generate_datasheet_text(data):
    """Generate detailed text datasheet"""
    component_name = data.get('componentName', 'Component')
    manufacturer = data.get('manufacturer', 'Unknown')
    specifications = data.get('specifications', [])
    criteria_matches = data.get('criteriaMatches', [])
    performance_metrics = data.get('performanceMetrics', [])
    component_type = data.get('componentType', 'unknown')
    
    text_lines = [
        "═" * 55,
        "           COMPONENT TECHNICAL DATASHEET",
        "═" * 55,
        "",
        f"Component:        {component_name}",
        f"Manufacturer:     {manufacturer}",
        f"Type:             {component_type}",
        f"Generated:        {datetime.now().strftime('%Y-%m-%d')}",
        "",
        "─" * 55,
        "TECHNICAL SPECIFICATIONS",
        "─" * 55,
    ]
    
    for spec in specifications:
        text_lines.append(f"• {spec}")
    
    text_lines.extend([
        "",
        "─" * 55,
        "REQUIREMENTS COMPLIANCE",
        "─" * 55,
    ])
    
    for criteria in criteria_matches:
        status = "✓" if criteria.get('met') else "✗"
        name = criteria.get('name', '')
        requirement = criteria.get('requirement', '')
        value = criteria.get('value', '')
        weight = criteria.get('weight', '').upper()
        
        text_lines.extend([
            f"{status} {name} ({weight})",
            f"    Requirement: {requirement}",
            f"    Your Input:  {value}",
            "",
        ])
    
    text_lines.extend([
        "─" * 55,
        "PERFORMANCE ANALYSIS",
        "─" * 55,
    ])
    
    for metric in performance_metrics:
        status = "PASS" if metric.get('met') else "MARGINAL"
        label = metric.get('label', '')
        value = metric.get('value', '')
        target = metric.get('target', '')
        
        text_lines.append(f"• {label}: {value} (Target: {target}) - {status}")
    
    text_lines.extend([
        "",
        "═" * 55,
    ])
    
    return '\n'.join(text_lines)
