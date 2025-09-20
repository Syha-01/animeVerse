import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

// A quote type/object
interface Quote {
  id: number;
  content: string;
  author: string;
}

export default function QuotesScreen() {
  // State variables with TypeScript types
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch quotes
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/v1/quotes?sort=-id');
      if (!response.ok) {
        throw new Error('Failed to fetch Quotes');
      }
      const data = await response.json();
      setQuotes(data.quotes);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchQuotes();
  }, []);

  // Display a loading indicator while fetching data
  if (loading) {
    return (
      <Box className="items-center justify-center flex-1 bg-background-dark-950">
        <ActivityIndicator size="large" color="#ffffff" />
      </Box>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <Box className="items-center justify-center flex-1 p-4 bg-background-dark-950">
        <Text className="text-center text-red-500">Error: {error.message}</Text>
      </Box>
    );
  }

  // Render the list of quotes
  return (
    <Box className="flex-1 py-6 bg-background-dark-950">
      <ScrollView className="px-4">
        {quotes.map((quote) => (
          <Box key={quote.id} className="p-4 mb-4 bg-gray-800 rounded-lg">
            <Text className="text-lg text-white">"{quote.content}"</Text>
            <Text className="mt-2 text-right text-gray-400">- {quote.author}</Text>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
}
