
function getIcosaVerts(){
    var phi = ( 1 + Math.sqrt( 5 ) ) * 0.5;
    var icosaVerts = [  
        new Vector4(  0.0,  1.0,  phi, 1.0 ), // Top-Front     0
        new Vector4(  0.0,  1.0, -phi, 1.0 ), // Top-Back      1
        new Vector4(  0.0, -1.0,  phi, 1.0 ), // Bottom-Front  2
        new Vector4(  0.0, -1.0, -phi, 1.0 ), // Bottom-Back   3
        new Vector4(  1.0,  phi,  0.0, 1.0 ), // Right-Top     4
        new Vector4(  1.0, -phi,  0.0, 1.0 ), // Right-Bottom  5
        new Vector4( -1.0,  phi,  0.0, 1.0 ), // Left-Top      6
        new Vector4( -1.0, -phi,  0.0, 1.0 ), // Left-Bottom   7
        new Vector4(  phi,  0.0,  1.0, 1.0 ), // Right-Front   8
        new Vector4( -phi,  0.0,  1.0, 1.0 ), // Left-Front    9
        new Vector4(  phi,  0.0, -1.0, 1.0 ), // Right-Back    10
        new Vector4( -phi,  0.0, -1.0, 1.0 )// Left-Back     11
    ];
    return icosaVerts;
}

function getIcosaFaces(){
    var icosaIndexList = [  
        4, 6, 0,
        4, 1, 6,
        5, 2, 7,
        5, 7, 3,
        4, 10, 1,
        4, 0, 8,
        0, 2, 8,
        0, 9, 2,
        0, 6, 9,
        1, 10, 3,
        1, 3, 11,
        1, 11, 6,
        3, 10, 5,
        3, 7, 11,
        8, 10, 4,
        8, 5, 10,
        9, 6, 11,
        9, 11, 7,
        9, 7, 2,
        8, 2, 5
    ];
    return icosaIndexList;
}