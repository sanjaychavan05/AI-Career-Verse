// Avatar mapping for all users in the platform
// Uses DiceBear API for consistent, unique 3D avatars

const AVATAR_MAP = {
  // Mentors
  'Anusha M': 'https://api.dicebear.com/7.x/personas/svg?seed=Anusha&backgroundColor=b6e3f4',
  'Rahul Patel': 'https://api.dicebear.com/7.x/personas/svg?seed=Rahul&backgroundColor=c0aede',
  'Sneha Kapoor': 'https://api.dicebear.com/7.x/personas/svg?seed=Sneha&backgroundColor=d1d4f9',
  'James Wilson': 'https://api.dicebear.com/7.x/personas/svg?seed=James&backgroundColor=ffd5dc',
  'Nina Patel': 'https://api.dicebear.com/7.x/personas/svg?seed=Nina&backgroundColor=c0f0e8',
  'Ryan Kim': 'https://api.dicebear.com/7.x/personas/svg?seed=Ryan&backgroundColor=ffdfbf',

  // Community users
  'Arjun Mehta': 'https://api.dicebear.com/7.x/personas/svg?seed=Arjun&backgroundColor=c0aede',
  'Sneha Reddy': 'https://api.dicebear.com/7.x/personas/svg?seed=SReddy&backgroundColor=ffd5dc',
  'Kavya Nair': 'https://api.dicebear.com/7.x/personas/svg?seed=Kavya&backgroundColor=ffdfbf',
};

/**
 * Get avatar URL for a user by name.
 * Falls back to a DiceBear generated avatar using the name as seed.
 */
export function getAvatar(name) {
  if (!name) return 'https://api.dicebear.com/7.x/personas/svg?seed=default&backgroundColor=b6e3f4';
  return AVATAR_MAP[name] || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;
}

/**
 * Avatar component props helper — returns style for img tag
 */
export function avatarStyle(size = 40) {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
  };
}

export default AVATAR_MAP;
