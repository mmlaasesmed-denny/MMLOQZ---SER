def update_cat_widths():
    file_path = '/Users/sunildennis/antigravity/Visual-Website-Builder/src/components/WebshopComponent.tsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We want to replace md:w-[35%] with md:w-[length:var(--cat-img-w)]
    # and md:w-[65%] with md:w-[length:var(--cat-txt-w)]
    
    # We also need to add the style variables to the container
    # The container is:
    # className="flex flex-col md:flex-row bg-slate-50 min-h-[320px]"
    
    old_container = 'className="flex flex-col md:flex-row bg-slate-50 min-h-[320px]"'
    new_container = '''className="flex flex-col md:flex-row bg-slate-50 min-h-[320px]"
                    style={{
                      '--cat-img-w': `${categoryImageWidth}%`,
                      '--cat-txt-w': `${100 - categoryImageWidth}%`
                    } as React.CSSProperties}'''
                    
    content = content.replace(old_container, new_container)
    
    # Replace the exact tailwind classes in this block
    # We only want to replace it in the categories block, but these classes are only used here.
    content = content.replace('md:w-[35%]', 'md:w-[length:var(--cat-img-w)]')
    content = content.replace('md:w-[65%]', 'md:w-[length:var(--cat-txt-w)]')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Updated categories image/text widths.")

if __name__ == '__main__':
    update_cat_widths()
