import os
import datetime

# --- KONFIGURASI ---
# Ubah ini menjadi True jika ingin 1 file, False jika ingin dipecah 3 file
MODE_SINGLE_FILE = False 

# Folder yang ingin diambil (Core Laravel + Database)
TARGET_FOLDERS = [
    'app',
    'routes',
    'resources/js',
    'resources/views',
    'config',
    'database/migrations',   # BARU: Struktur Database
    'database/seeders',      # BARU: Data Awal
    'database/factories'     # BARU: Data Testing
]

# File spesifik di root yang penting (Dependencies & Config)
ROOT_FILES = [
    'composer.json',
    'package.json',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    '.env.example'
]

# Ekstensi file yang ingin diambil
VALID_EXTENSIONS = ['.php', '.js', '.jsx', '.vue', '.css', '.scss', '.blade.php', '.json']

# Folder yang HARUS DIABAIKAN
EXCLUDE_FOLDERS = ['node_modules', 'vendor', '.git', 'storage', 'bootstrap/cache', 'public', 'tests']

# --- LOGIKA SCRIPT ---

def get_all_files(root_dir):
    collected_files = []
    
    # 1. Ambil dari Folder Target
    for folder in TARGET_FOLDERS:
        full_path = os.path.join(root_dir, folder)
        if not os.path.exists(full_path):
            continue
            
        for dirpath, dirnames, filenames in os.walk(full_path):
            dirnames[:] = [d for d in dirnames if d not in EXCLUDE_FOLDERS]
            
            for filename in filenames:
                if any(filename.endswith(ext) for ext in VALID_EXTENSIONS):
                    full_file_path = os.path.join(dirpath, filename)
                    collected_files.append(full_file_path)

    # 2. Ambil File Root Spesifik
    for filename in ROOT_FILES:
        full_path = os.path.join(root_dir, filename)
        if os.path.exists(full_path):
            collected_files.append(full_path)
                    
    return collected_files

def read_file_content(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

def write_to_file(output_name, content):
    with open(output_name, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Berhasil dibuat: {output_name}")

def categorize_file(filepath):
    # Logika pemecahan file yang lebih lengkap
    if 'resources/js' in filepath or 'resources/views' in filepath:
        return 'frontend'
    elif 'routes' in filepath or 'config' in filepath or \
         'composer.json' in filepath or 'package.json' in filepath or \
         'vite.config' in filepath or 'tailwind.config' in filepath:
        return 'routes_config'
    else: 
        # app, database/migrations, database/seeders masuk sini
        return 'backend'

def main():
    root_dir = os.getcwd()
    files = get_all_files(root_dir)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    header_info = f"""
    ==========================================
    DUMP KODINGAN LARAVEL PROJECT (LENGKAP)
    Tanggal: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    Total File Ditemukan: {len(files)}
    ==========================================
    
    """

    if MODE_SINGLE_FILE:
        output_filename = f"FULL_PROJECT_CODE_{timestamp}.txt"
        print(f"Sedang menggabungkan {len(files)} file ke dalam 1 file...")
        
        full_content = header_info
        
        for file_path in files:
            relative_path = os.path.relpath(file_path, root_dir)
            content = read_file_content(file_path)
            
            separator = f"\n\n// ==========================================\n// FILE: {relative_path}\n// ==========================================\n\n"
            full_content += separator + content
            
        write_to_file(output_filename, full_content)

    else:
        print("Sedang memisahkan file menjadi 3 kategori...")
        
        contents = {
            'backend': header_info + "// --- BACKEND (Controllers, Models, MIGRATIONS, Seeders) ---\n",
            'frontend': header_info + "// --- FRONTEND (React/Vue/JS/Components, Views) ---\n",
            'routes_config': header_info + "// --- ROUTES, CONFIG, DEPENDENCIES (composer.json, package.json) ---\n"
        }
        
        for file_path in files:
            relative_path = os.path.relpath(file_path, root_dir)
            content = read_file_content(file_path)
            category = categorize_file(file_path)
            
            separator = f"\n\n// ------------------------------------------\n// FILE: {relative_path}\n// ------------------------------------------\n\n"
            contents[category] += separator + content

        write_to_file(f"01_BACKEND_CORE_{timestamp}.txt", contents['backend'])
        write_to_file(f"02_FRONTEND_UI_{timestamp}.txt", contents['frontend'])
        write_to_file(f"03_ROUTES_CONFIG_{timestamp}.txt", contents['routes_config'])

    print("Selesai!")

if __name__ == "__main__":
    main()