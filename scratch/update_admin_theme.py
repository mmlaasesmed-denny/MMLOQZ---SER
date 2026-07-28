def update_admin_theme():
    file_path = '/Users/sunildennis/antigravity/Visual-Website-Builder/src/components/WebshopComponent.tsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = 4127  # 0-indexed for line 4128
    end_idx = 5490    # up to line 5490
    
    admin_block_lines = lines[start_idx:end_idx]
    
    new_admin_block_lines = []
    
    for line in admin_block_lines:
        new_line = line
        
        # Backgrounds
        new_line = new_line.replace('bg-slate-900/40', 'bg-slate-50')
        new_line = new_line.replace('bg-slate-900/60', 'bg-white')
        new_line = new_line.replace('bg-slate-900/20', 'bg-slate-50')
        new_line = new_line.replace('bg-slate-900/30', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-950/60', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-950/40', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-950/20', 'bg-slate-50')
        new_line = new_line.replace('bg-slate-955/60', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-900', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-950', 'bg-white')
        new_line = new_line.replace('bg-slate-955', 'bg-white')
        new_line = new_line.replace('bg-slate-850', 'bg-slate-100')
        new_line = new_line.replace('bg-slate-800', 'bg-slate-200')
        new_line = new_line.replace('bg-slate-950/80', 'bg-slate-900/50')
        
        # Hover Backgrounds
        new_line = new_line.replace('hover:bg-slate-900', 'hover:bg-slate-100')
        new_line = new_line.replace('hover:bg-slate-700', 'hover:bg-slate-300')
        new_line = new_line.replace('hover:bg-slate-800', 'hover:bg-slate-200')
        new_line = new_line.replace('hover:bg-slate-950', 'hover:bg-slate-200')
        
        # Borders
        new_line = new_line.replace('border-slate-800/80', 'border-slate-200')
        new_line = new_line.replace('border-slate-800/60', 'border-slate-200')
        new_line = new_line.replace('border-slate-800/40', 'border-slate-200')
        new_line = new_line.replace('border-slate-800', 'border-slate-200')
        new_line = new_line.replace('border-slate-700', 'border-slate-300')
        
        new_line = new_line.replace('hover:border-slate-700', 'hover:border-slate-300')
        new_line = new_line.replace('border-b border-slate-800', 'border-b border-slate-200')
        new_line = new_line.replace('border-t border-slate-800', 'border-t border-slate-200')
        
        # Text colors
        new_line = new_line.replace('text-white', 'text-slate-900')
        new_line = new_line.replace('text-slate-300', 'text-slate-700')
        new_line = new_line.replace('text-slate-400', 'text-slate-600')
        new_line = new_line.replace('text-slate-450', 'text-slate-600')
        new_line = new_line.replace('text-slate-500', 'text-slate-500')
        new_line = new_line.replace('text-slate-505', 'text-slate-500')
        new_line = new_line.replace('text-slate-550', 'text-slate-600')
        new_line = new_line.replace('text-slate-350', 'text-slate-700')
        new_line = new_line.replace('text-slate-200', 'text-slate-700')
        
        new_line = new_line.replace('hover:text-white', 'hover:text-slate-900')
        
        # Divide
        new_line = new_line.replace('divide-slate-800/60', 'divide-slate-200')
        new_line = new_line.replace('divide-slate-800', 'divide-slate-200')

        # Shadow adjustments
        new_line = new_line.replace('shadow-md shadow-amber-400/10', 'shadow-md shadow-amber-400/30')
        new_line = new_line.replace('shadow-xl', 'shadow-lg shadow-slate-200')

        new_admin_block_lines.append(new_line)
        
    lines[start_idx:end_idx] = new_admin_block_lines
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
        
    print("Admin theme updated via python script.")

if __name__ == '__main__':
    update_admin_theme()
