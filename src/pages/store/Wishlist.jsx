import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-8">My Wishlist</h1>
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save items you love here to buy them later."
        action={
          <Link to="/store">
            <Button>Explore Products</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Wishlist;
