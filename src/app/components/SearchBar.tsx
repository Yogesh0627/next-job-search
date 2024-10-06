
export function SearchBar({ extraClasses }: { extraClasses: string }) {
    return (
        // <div>
            <input 
                className={`${extraClasses}`} 
                type="text" 
                placeholder="Enter Job Name / company / skills / role" 
            />
        // </div>
    );
}
