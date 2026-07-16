import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnable, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <>
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar online">
              <button
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="User Profile"
                  className="size-full object-cover"
                />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImgUpload}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="text-slate-200 font-medium text-balance max-w-[180px] truncate">
                {authUser?.fullName}
              </h3>

              <p className="text-slate-400 text-xs">online</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              className="text-slate-400 hover:text-slate-200 translate-color"
              onClick={logout}
            >
              <LogOutIcon className="size-5" />
            </button>

            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => {
                mouseClickSound.currentTime = 0;
                mouseClickSound
                  .play()
                  .catch((error) =>
                    console.log("Audio played failed: ", error),
                  );
                toggleSound();
              }}
            >
              {isSoundEnable ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
